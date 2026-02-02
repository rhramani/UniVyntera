const axios = require("axios");
const { CTCCredentials } = require("./configuration");
const Lead = require("../../model/lead");
const User = require("../../model/user");
const StudentApplication = require("../../model/masters/studentApplication/studentApplication");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const ApplicationProcesshistory = require("../../model/studentProcessHistory");

const normalizePhone = (phone) => {
  return phone.replace(/\D/g, "").slice(-10);
};

let cachedToken = null;
let tokenExpiryTime = null;

const getCTCToken = async () => {
  if (cachedToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedToken;
  }

  const config = await CTCCredentials();

  const url = `${config.CTC_BASE_URL}/clicktocall/AuthToken`;

  const response = await axios.post(
    url,
    {
      username: config.CTC_USERNAME,
      password: config.CTC_PASSWORD,
    },
    { timeout: 10000 },
  );

  const { idToken, expiresIn } = response.data;

  cachedToken = idToken;
  tokenExpiryTime = Date.now() + (expiresIn - 60) * 1000;

  return cachedToken;
};

const initiateCall = async ({ agentPhone, customerPhone, leadId }) => {
  const token = await getCTCToken();
  const config = await CTCCredentials();

  const payload = {
    cli: normalizePhone(config.CLINumber),
    apartyno: normalizePhone(agentPhone),
    bpartyno: normalizePhone(customerPhone),
    reference_id: leadId,
    dtmfflag: config.CTC_DTMF_FLAG,
    recordingflag: config.CTC_RECORDING_FLAG,
  };

  const response = await axios.post(
    `${config.CTC_BASE_URL}/clicktocall/initiate-call`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (response.data.status !== 1) {
    throw new Error("Call initiation failed");
  }

  return response.data;
};

const resolveEntityPhone = async (entityType, entityId) => {
  switch (entityType) {
    case "lead": {
      const lead = await Lead.findById(entityId).select("phone");
      if (!lead?.phone) {
        throw { status: 400, message: "Lead phone not found" };
      }
      return {
        phone: lead.phone,
        refId: lead._id.toString(),
      };
    }

    case "student": {
      const student =
        await StudentApplication.findById(entityId).select("contact");
      if (!student?.contact) {
        throw { status: 400, message: "Student phone not found" };
      }
      return {
        phone: student.contact,
        refId: student._id.toString(),
      };
    }

    case "b2b": {
      const b2b = await B2BAdmin.findById(entityId).select("phone");
      if (!b2b?.phone) {
        throw { status: 400, message: "B2B phone not found" };
      }
      return {
        phone: b2b.phone,
        refId: b2b._id.toString(),
      };
    }

    default:
      throw { status: 400, message: "Invalid call entity type" };
  }
};

const callEntity = async (entityType, entityId, agentId) => {
  const agent = await User.findById(agentId).select("phone");
  if (!agent?.phone) {
    throw { status: 400, message: "Agent phone not found" };
  }

  const { phone: customerPhone } = await resolveEntityPhone(
    entityType,
    entityId,
  );

  const refId = `SV|${entityType}|${entityId}`;

  await initiateCall({
    agentPhone: agent.phone,
    customerPhone,
    leadId: refId,
  });

  return true;
};

const callDialerEntity = async (number, agentId) => {
  const agent = await User.findById(agentId).select("phone");
  if (!agent?.phone) {
    throw { status: 400, message: "Agent phone not found" };
  }

  const refId = `SV|dialer|${agentId}`;

  await initiateCall({
    agentPhone: agent.phone,
    customerPhone: number, // ✅ FIX
    leadId: agentId, // or pass actual leadId if available
  });

  return true;
};

const ctcPingBack = async (data) => {
  if (data.EVENT_TYPE !== "Call End") {
    return;
  }

  const leadId = data.REF_ID;
  const recordingUrl = data.RecordVoice;
  if (!leadId || !recordingUrl) {
    return;
  }

  await Lead.findByIdAndUpdate(leadId, {
    callRecordingUrl: recordingUrl,
  });
};

const parseCTCTime = (ctcTime) => {
  if (!ctcTime || ctcTime.length !== 14) return null;

  const day = ctcTime.slice(0, 2);
  const month = ctcTime.slice(2, 4);
  const year = ctcTime.slice(4, 8);
  const hour = ctcTime.slice(8, 10);
  const minute = ctcTime.slice(10, 12);
  const second = ctcTime.slice(12, 14);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};

const formatDuration = (totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) return "0 s";

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} s`;
  }
  return `${minutes} m ${seconds} s`;
};

const updateEntityRecording = async ({
  entityType,
  entityId,
  recordingUrl,
}) => {
  switch (entityType) {
    case "lead":
      return Lead.findByIdAndUpdate(entityId, {
        CTCCallRecording: recordingUrl,
      });

    case "student":
      return StudentApplication.findByIdAndUpdate(entityId, {
        CTCCallRecording: recordingUrl,
      });

    case "b2b":
      return B2BAdmin.findByIdAndUpdate(entityId, {
        CTCCallRecording: recordingUrl,
      });

    default:
      return;
  }
};

const resolveEntityByRefId = async (refId) => {
  const lead = await Lead.findById(refId).select("_id");

  if (lead) {
    return { type: "lead", model: Lead, leadId: lead._id };
  }

  const student = await StudentApplication.findById(refId).select("_id");
  if (student) {
    return {
      type: "student",
      model: StudentApplication,
      studentId: student._id,
    };
  }

  const b2b = await B2BAdmin.findById(refId);
  if (b2b) {
    return { type: "b2b", model: B2BAdmin };
  }

  return null;
};

const getModelByType = (type) => {
  switch (type) {
    case "lead":
      return Lead;
    case "student":
      return StudentApplication;
    case "b2b":
      return B2BAdmin;
    default:
      return null;
  }
};

const ctcWebhook = async (data) => {
  const rawRefId = data.REF_ID;
  if (!rawRefId) return;

  let source, entityType, entityId;

  if (rawRefId.includes("|")) {
    [source, entityType, entityId] = rawRefId.split("|");
  } else {
    return; // StudyVisa should only accept prefixed calls
  }

  // ✅ Process ONLY StudyVisa calls
  if (source !== "SV") return;

  if (data.EVENT_TYPE !== "Call End") return;
  if (entityType === "dialer") return;

  const model = getModelByType(entityType);
  if (!model || !entityId) return;

  const recordingUrl = data.RecordVoice?.replace(/^"+|"+$/g, "");
  if (!recordingUrl) return;

  const callStartTime = parseCTCTime(data.CALL_START_TIME);
  const callEndTime = parseCTCTime(data.B_PARTY_END_TIME);

  const callDurationSeconds =
    callStartTime && callEndTime
      ? Math.floor((callEndTime - callStartTime) / 1000)
      : null;

  const callDurationText = formatDuration(callDurationSeconds);

  await model.findByIdAndUpdate(entityId, {
    CTCCallRecording: recordingUrl,
  });

  if (entityType === "b2b") return;

  const historyFilter =
    entityType === "lead" ? { leadId: entityId } : { studentId: entityId };

  await ApplicationProcesshistory.updateOne(
    historyFilter,
    {
      $setOnInsert: historyFilter,
      $push: {
        history: {
          event: "CTC_Calling",
          value: {
            agentNumber: data.A_PARTY_NO,
            customerNumber: data.B_PARTY_NO,
            callDuration: callDurationText,
            recordingUrl,
            disconnectedBy: data.DISCONNECTED_BY,
          },
          date: new Date(),
        },
      },
    },
    { upsert: true },
  );
};

module.exports = {
  getCTCToken,
  callDialerEntity,
  initiateCall,
  callEntity,
  ctcPingBack,
  ctcWebhook,
};
