const express = require("express");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const router = require("express").Router();
const leadService = require("../services/lead");
const leadStatus = require("../../model/leadStatus");
const Lead = require("../../model/aiCallLead");
const {
  dispatchCall,
  getCallLogs,
  fetchBulkCalls,
  createBulkCall,
  bulkCallActions,
  cancelBulkCall,
  detailBulkCall,
} = require("../services/voiceAI");

router.post("/dispatch", async (req, res) => {
  try {
    const { agentId, toNumber, fromNumberId, callContext } = req.body;

    const result = await dispatchCall(
      agentId,
      toNumber,
      fromNumberId,
      callContext
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    const status = err.status || 500;
    res
      .status(status)
      .json({ success: false, message: err.message, details: err.details });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const { page, pageSize, agentId, callStatus } = req.query;
    const logs = await getCallLogs({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 30,
      agentId,
      callStatus,
    });
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    const status = err.status || 500;
    res
      .status(status)
      .json({ success: false, message: err.message, details: err.details });
  }
});

module.exports = router;

// ======================
// Bulk Call Routes
// ======================

router.get("/bulk/list", async (req, res) => {
  try {
    const { page, page_size, status } = req.query;
    const data = await fetchBulkCalls(page, page_size, status);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message, details: err.details });
  }
});

router.post("/bulk/create", async (req, res) => {
  try {
    // Build contact_list from Lead Service instead of expecting it in req.body
    // Defaults and coercions
    const coerceBool = (v) => {
      if (typeof v === "boolean") return v;
      if (typeof v === "string") return v.toLowerCase() === "true";
      return false;
    };
    const coerceInt = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const phone_number_id = process.env.OMNIDIM_DEFAULT_PHONE_NUMBER_ID;
    const name = "New Lead Inquiry";
    const is_scheduled = false; // default: immediate
    const scheduled_datetime = undefined; // provide via req.body if needed
    const timezone = "UTC";
    const retry_config = {
      auto_retry: true,
      auto_retry_schedule: "scheduled_time",
      retry_schedule_days: 2,
      retry_schedule_hours: 6,
      retry_limit: 2,
    };
    const enabled_reschedule_call = true;

    const envDefaultFromNumberId = process.env.OMNIDIM_DEFAULT_PHONE_NUMBER_ID
      ? Number(process.env.OMNIDIM_DEFAULT_PHONE_NUMBER_ID)
      : undefined;

    const resolvedPhoneNumberId =
      phone_number_id !== undefined &&
      phone_number_id !== null &&
      phone_number_id !== ""
        ? Number(phone_number_id)
        : envDefaultFromNumberId;

    if (!Number.isFinite(resolvedPhoneNumberId)) {
      return res.status(400).json({
        success: false,
        message:
          "phone_number_id is required (provide in body or set OMNIDIM_DEFAULT_PHONE_NUMBER_ID)",
      });
    }

    const normalizePhone = (raw) => {
      if (typeof raw !== "string") return null;
      const digits = raw.replace(/[^\d+]/g, "");
      const stripped = digits.replace(/\D/g, "");
      const withPlus = digits.startsWith("+") ? `+${stripped}` : `+${stripped}`;
      // E.164 length between 7 and 15 digits (excluding '+')
      if (/^\+\d{7,15}$/.test(withPlus)) return withPlus;
      return null;
    };

    const leads = await leadService.allNewLead();

    const contact_list = (Array.isArray(leads) ? leads : [])
      .map((l) => {
        const normalized = normalizePhone(l.phone);
        if (!normalized) return null;
        return {
          phone_number: normalized,
          lead_id: String(l._id),
          name: l.name,
          email: l.email,
          country_interested: Array.isArray(l.country_interested)
            ? l.country_interested
            : [],
          course: l.course || "",
          intake: l.intake || "",
          level: l.level || "",
          source_of_reference: l.source_of_reference || "",
        };
      })
      .filter(Boolean);

     

    if (contact_list.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid leads with callable E.164 phone numbers",
      });
    }

    const payload = {
      name: name || `Leads Campaign - ${new Date().toISOString()}`,
      contact_list,
      phone_number_id: resolvedPhoneNumberId,
    };
    if (typeof is_scheduled !== "undefined")
      payload.is_scheduled = coerceBool(is_scheduled);
    if (scheduled_datetime) payload.scheduled_datetime = scheduled_datetime;
    if (timezone) payload.timezone = timezone;
    if (retry_config) {
      payload.retry_config = {
        auto_retry: coerceBool(retry_config.auto_retry),
        auto_retry_schedule: retry_config.auto_retry_schedule,
        retry_schedule_days: coerceInt(retry_config.retry_schedule_days),
        retry_schedule_hours: coerceInt(retry_config.retry_schedule_hours),
        retry_limit: coerceInt(retry_config.retry_limit),
      };
    }
    if (typeof enabled_reschedule_call !== "undefined")
      payload.enabled_reschedule_call = coerceBool(enabled_reschedule_call);

    const data = await createBulkCall(payload);
    res.status(200).json({
      success: true,
      data,
      meta: { total_contacts: contact_list.length },
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message, details: err.details });
  }
});

router.post("/bulk/actions", async (req, res) => {
  try {
    const data = await bulkCallActions(req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message, details: err.details });
  }
});

router.post("/bulk/cancel", async (req, res) => {
  try {
    const data = await cancelBulkCall(req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message, details: err.details });
  }
});

router.get("/bulk/detail", async (req, res) => {
  try {
    const { bulk_call_id } = req.query;
    const data = await detailBulkCall({ bulk_call_id: Number(bulk_call_id) });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message, details: err.details });
  }
});

// Helper: Create bulk call from all "New" leads
router.post("/bulk/create-from-new-leads", async (req, res) => {
  try {
    const {
      phone_number_id,
      name,
      is_scheduled,
      scheduled_datetime,
      timezone,
      retry_config,
      enabled_reschedule_call,
    } = req.body;

    if (!phone_number_id)
      return res
        .status(400)
        .json({ success: false, message: "phone_number_id is required" });

    const leads = await leadService.allNewLead();
    const contact_list = (leads || [])
      .filter(
        (l) => typeof l.phone === "string" && /^\+\d{6,15}$/.test(l.phone)
      )
      .map((l) => ({
        phone_number: l.phone,
        lead_id: String(l._id),
        name: l.name,
        email: l.email,
      }));

    if (contact_list.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid E.164 phone numbers found in New leads",
      });
    }

    const payload = {
      name: name || `New Leads Campaign - ${new Date().toISOString()}`,
      contact_list,
      phone_number_id: Number(phone_number_id),
    };
    if (typeof is_scheduled !== "undefined")
      payload.is_scheduled = Boolean(is_scheduled);
    if (scheduled_datetime) payload.scheduled_datetime = scheduled_datetime;
    if (timezone) payload.timezone = timezone;
    if (retry_config) payload.retry_config = retry_config;
    if (typeof enabled_reschedule_call !== "undefined")
      payload.enabled_reschedule_call = Boolean(enabled_reschedule_call);

    const data = await createBulkCall(payload);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message, details: err.details });
  }
});

router.post("/webhook", (req, res) => {
  const data = req.body;
  //   const data ={
  //   "call_id": 213751,
  //   "call_sid": "59b48f3c2159fdd018bcd77dcfb719av",
  //   "bot_id": 45116,
  //   "bot_name": "Final EduCa CRM Agent",
  //   "phone_number": "+917948515656",
  //   "to_number": "+919979415476",
  //   "call_request_id": 193662,
  //   "from_number": "+917948515656",
  //   "call_date": "2025-10-31 03:51:45",
  //   "user_email": "darpan@smartxcrm.com",
  //   "call_status": "completed",
  //   "recording_url": "https://recordings.exotel.com/exotelrecordings/smartxcrm1/5f5b2c3a24d0b6e5f1bfbf4bd81119av.mp3",
  //   "recording_available_at": "2025-10-31 03:58:13",
  //   "low_interaction": false,
  //   "call_report": {
  //     "summary": "The user, Shruti Vaviya, is planning to study in Germany and is interested in the January intake. She requested to reschedule the call because she was at her office.",
  //     "sentiment": "Neutral",
  //     "extracted_variables": {
  //       "name": "Shruti Vaviya",
  //       "reschedule_datetime": "Not provided",
  //       "reschedule_reason": "user requested reschedule",
  //       "reschedule_requested": "yes",
  //       "interaction_count_total": 10
  //     },
  //     "full_conversation": "LLM: hi, my name is moksha and i'm calling from educa. is this the right time to talk?\nUSER: Hello. Yes.\nLLM: great! can i confirm that i'm speaking with shruti vaviya? also, which language are you more comfortable with—hindi or english?\nUSER: Yes.\nUSER: Yes. Yes.\nLLM: thank you! now, could you tell me if you have any specific country in mind for your studies abroad, or would you like some suggestions?\nUSER: No.\nUSER: No.\nUSER: No. I am planning to go Germany.\nLLM: that’s wonderful! germany has great educational opportunities. could you share your latest qualification and the year you completed it?\nUSER: Yes, I have like completed my masters of computer application with computer science in like this last educational year.\nLLM: got it! so, you completed your master's in computer applications recently. have you taken or planned to take any english proficiency tests like ielts or pte?\nUSER: No, I haven't.\nLLM: that's okay! if you need help with preparation, we can guide you through that. do you have a specific intake period in mind for starting your studies in germany?\nUSER: Hello? Hello.\nLLM: i'm here! do you\nUSER: I think the next January will be fine.\nLLM: great! so you're planning for the january intake. now, could you share your budget for studying in germany? and have you shortlisted any universities or consultants yet?\nUSER: हां No no actually I am at my office I will like call you back.\nUSER: हां No no actually I am at my office I will like call you back. Okay.\nLLM: that's perfectly fine! just let me know a convenient time for you to talk, and we'll continue from where we left off. thank you for your time, shruti, and have a great day at work!\nUSER: Yeah, I need it.\n",
  //     "interactions": [
  //       { "speaker": "LLM", "message": "hi, my name is moksha and i'm calling from educa. is this the right time to talk?" },
  //       { "speaker": "USER", "message": "Hello. Yes." },
  //       { "speaker": "LLM", "message": "great! can i confirm that i'm speaking with shruti vaviya? also, which language are you more comfortable with—hindi or english?" },
  //       { "speaker": "USER", "message": "Yes." },
  //       { "speaker": "USER", "message": "Yes. Yes." },
  //       { "speaker": "LLM", "message": "thank you! now, could you tell me if you have any specific country in mind for your studies abroad, or would you like some suggestions?" },
  //       { "speaker": "USER", "message": "No." },
  //       { "speaker": "USER", "message": "No. I am planning to go Germany." },
  //       { "speaker": "LLM", "message": "that’s wonderful! germany has great educational opportunities. could you share your latest qualification and the year you completed it?" },
  //       { "speaker": "USER", "message": "Yes, I have like completed my masters of computer application with computer science in like this last educational year." }
  //     ]
  //   },
  //   "bulk_call_name": "New Lead Inquiry",
  //   "metadata": {
  //     "lead_id": "690040180f9b366077574b1c",
  //     "name": "shruti vaviya",
  //     "email": "shruti12@gmail.com",
  //     "country_interested": [],
  //     "course": "",
  //     "intake": "",
  //     "level": "",
  //     "source_of_reference": ""
  //   }
  // }

  console.log("Received webhook:", data);

  // const mapCallStatusToLeadStatus = (status) => {
  //   const s = String(status || '').toLowerCase();
  //   if (['answered', 'completed', 'success', 'connected'].includes(s)) return 'Connected';
  //   if (['ringing', 'queued', 'initiated', 'dialing'].includes(s)) return 'Calling';
  //   if (['busy', 'failed', 'no_answer', 'not_answered', 'unreachable'].includes(s)) return 'Not Connected';
  //   if (['cancelled', 'canceled', 'stopped'].includes(s)) return 'Cancelled';
  //   return null;
  // };

  // const normalizeE164 = (raw) => {
  //   if (typeof raw !== 'string' || raw.trim() === '') return null;
  //   const digitsOnly = raw.replace(/[^\d+]/g, '');
  //   const stripped = digitsOnly.replace(/\D/g, '');
  //   const withPlus = digitsOnly.startsWith('+') ? `+${stripped}` : `+${stripped}`;
  //   if (/^\+\d{7,15}$/.test(withPlus)) return withPlus;
  //   return null;
  // };

  // const lastNDigits = (value, n = 10) => {
  //   if (typeof value !== 'string') return null;
  //   const onlyDigits = value.replace(/\D/g, '');
  //   if (!onlyDigits) return null;
  //   return onlyDigits.slice(-n);
  // };

  (async () => {
    try {
      // console.log("onee");
      let metadata = data && data.metadata;
      if (typeof metadata === "string") {
        try {
          metadata = JSON.parse(metadata);
        } catch (e) {
          metadata = {};
        }
      }
      if (metadata && typeof metadata !== "object") metadata = {};

      const leadId = metadata?.lead_id || data.lead_id || data.leadId;
      const recordingUrl = data.recording_url;
      const toNumber =
        data.to_number ||
        data.toNumber ||
        data.phone_number ||
        data.phone ||
        data.to;

      // Force update to hot_lead regardless of call status when webhook is received
      const nextLeadStatus = (
        data.call_report?.extracted_variables?.lead_type || "Hot lead"
      ).trim();

      const existingStatus = await leadStatus.findOne({
        name: { $regex: new RegExp(`^${nextLeadStatus}$`, "i") },
      });

      if (!existingStatus) {
        await leadStatus.create({ name: nextLeadStatus });
      }

      // if (!leadId && !toNumber) {
      //   return res.status(200).json({
      //     success: true,
      //     message: "Received",
      //     note: "No identifiers to update",
      //   });
      // }

      const pdfDir = path.join(__dirname, "../../public/webhookReports");
      if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

      const timestamp = Date.now();
      const filename = `webhook_${leadId || "unknown"}_${timestamp}.pdf`;
      // console.log("filenameeee", filename);
      const filepath = path.join(pdfDir, filename);

      // console.log("filePathhhh", filepath);
      const html = `
  <html>
    <head>
      <meta charset="utf-8">
      <title>Voice AI Webhook Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; color: #222; }
        h1 { text-align: center; color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 5px; }
        h2 { color: #444; margin-top: 25px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
        .conversation { background: #f9f9f9; padding: 10px; border-radius: 8px; }
        .conversation p { margin: 6px 0; line-height: 1.4; }
        .llm { color: #0066cc; font-weight: bold; }
        .user { color: #333; font-weight: bold; }
        .small { color: #777; font-size: 13px; margin-top: 20px; }
        .recording a { color: #0077cc; text-decoration: none; }
        .recording a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Voice AI Webhook Report</h1>
      
      <h2>📞 Call Information</h2>
      <table>
   
        <tr><th>From</th><td>${data.to_number || "N/A"}</td></tr>
        <tr><th>Call Date</th><td>${data.call_date || "N/A"}</td></tr>
        
      </table>

      ${
        data.call_report?.summary
          ? `<h2>Summary</h2><p>${data.call_report.summary}</p>`
          : ""
      }

     
      ${
        data.call_report?.full_conversation
          ? (() => {
              // Split conversation into clean lines
              const parts = data.call_report.full_conversation
                .replace(/\\n/g, " ")
                .split(/(?=LLM:|USER:)/)
                .map((line) => line.trim())
                .filter((l) => l);

              return `
                <h2>Conversation</h2>
                <div class="conversation conversation-wrapper">
                  ${parts
                    .map((line) => {
                      if (line.startsWith("LLM:")) {
                        return `<div class="conversation-item llm"><span class="speaker">LLM:</span>${line
                          .replace(/^LLM:\s*/i, "")
                          .trim()}</div>`;
                      } else if (line.startsWith("USER:")) {
                        return `<div class="conversation-item user"><span class="speaker">User:</span>${line
                          .replace(/^USER:\s*/i, "")
                          .trim()}</div>`;
                      } else {
                        return `<div class="conversation-item">${line}</div>`;
                      }
                    })
                    .join("")}
                </div>
              `;
            })()
          : ""
      }

      <p class="small">Generated on ${new Date().toLocaleString()}</p>
    </body>
  </html>
`;

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.pdf({
        path: filepath,
        format: "A4",
        printBackground: true,
      });

      await browser.close();
      const pdfUrl = `/public/webhookReports/${filename}`;
      // console.log("pdfUrllllll", pdfUrl);

      let updated = null;
      if (leadId) {
        // Extract recording URL (adjust keys based on your actual webhook payload)
        // const recordingUrl = data.recording_url;
        // console.log("pdfUrlpdfUrl" , pdfUrl);
        updated = await Lead.findByIdAndUpdate(
          String(leadId),
          {
            $set: {
              lead_status: nextLeadStatus,
              voiceAICall: true,
              voiceAIRecording: recordingUrl,
              voiceAIPdf: pdfUrl,
              call_in_progress: false,
            },
          },
          { new: true }
        );
      }

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Lead not found for provided identifiers",
        });
      }

      return res.status(200).json({
        success: true,
        data: { lead_id: updated._id, lead_status: updated.lead_status },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  })();
});
