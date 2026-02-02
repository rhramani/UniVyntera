const mongoose = require("mongoose");

const ProcessHistory = require("../model/studentProcessHistory");
const Institute = require("../model/masters/institute");
const Campus = require("../model/masters/campus");
const Course = require("../model/masters/course");
const ProgramLevel = require("../model/masters/programLevel");
const Role = require("../model/masters/roles");
const User = require("../model/user");
const visaProcessHistory = require("./visaFlowTracking");
const Documents = require("../model/masters/documentList/documents");
const DocumentType = require("../model/masters/documentList/documentType");

const normalizeCountry = (country) => {
  if (!country) return "Universal";

  const c = country.toLowerCase();

  if (c.includes("australia")) return "Australia";
  if (c.includes("canada")) return "Canada";
  if (c.includes("france")) return "France";
  if (c.includes("germany")) return "Germany";
  if (c.includes("uk") || c.includes("united kingdom")) return "United Kingdom";
  if (c.includes("usa") || c.includes("united states")) return "United States";

  // If not matched, default to Universal
  return "Universal";
};

async function trackStudentEvents(
  oldData,
  newData,
  updateData,
  userId,
  userName
) {
  if (!oldData || !newData) return;

  const studentId = oldData._id;

  const events = [];

  // Utility: Push only valid + not-duplicate events
  const pushEvent = async (eventName, value) => {
    if (!value || value === "undefined" || value === undefined) return;

    // Fetch last event to avoid duplicates
    const existing = await ProcessHistory.findOne({
      studentId,
      history: {
        $elemMatch: { event: eventName, value: value },
      },
    });

    if (existing) return; // skip duplicate

    events.push({
      event: eventName,
      value,
      updated_by: userId,
      updatedByName: userName,
      date: new Date(),
    });
  };
  const isPrimitive = (val) =>
    val === null ||
    val === undefined ||
    typeof val !== "object" ||
    val instanceof Date;

  const diffObject = (oldObj, newObj) => {
    // ✅ Handle primitive values (string, number, boolean, date)
    if (isPrimitive(oldObj) && isPrimitive(newObj)) {
      if (JSON.stringify(oldObj) !== JSON.stringify(newObj)) {
        return {
          from: oldObj ?? null,
          to: newObj ?? null,
        };
      }
      return null;
    }

    // ✅ Handle arrays
    if (Array.isArray(oldObj) || Array.isArray(newObj)) {
      if (JSON.stringify(oldObj) !== JSON.stringify(newObj)) {
        return {
          from: oldObj ?? [],
          to: newObj ?? [],
        };
      }
      return null;
    }

    // ✅ Handle objects
    const changes = {};
    const keys = new Set([
      ...Object.keys(oldObj || {}),
      ...Object.keys(newObj || {}),
    ]);

    for (const key of keys) {
      const oldVal = oldObj?.[key];
      const newVal = newObj?.[key];

      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        changes[key] = {
          from: oldVal ?? null,
          to: newVal ?? null,
        };
      }
    }

    return Object.keys(changes).length ? changes : null;
  };

  const trackEdit = async (event, oldVal, newVal) => {
    const diff = diffObject(oldVal, newVal);
    if (diff) {
      await pushEvent(event, diff);
    }
  };

  const simpleFields = [
    "name",
    "contact",
    "alternateContact",
    "gender",
    "email",
    "DOB",
    "age",
    "address",
    "city",
    "state",
    "country",
    "passportNumber",
    "personalDetailStatus",
    "documentDetailStatus",
    "counsellingDetailStatus",
    "loanRequired",
    "loanAmount",
    "loanProvider",
    "visaByRG",
    "accountantStatus",
    "b2bCommissionRemarks",
    "docUploadByStudent",
  ];

  for (const field of simpleFields) {
    if (updateData[field] !== undefined) {
      await trackEdit(
        `${field}_updated`,
        oldData[field],
        newData[field]
      );
    }
  }

  if (updateData.educationDetailId && updateData.educationDetailUpdate) {
    const oldEdu = oldData.educationDetails?.find(
      (e) => e._id.toString() === updateData.educationDetailId.toString()
    );
    const newEdu = newData.educationDetails?.find(
      (e) => e._id.toString() === updateData.educationDetailId.toString()
    );

    await trackEdit("education_detail_updated", oldEdu, newEdu);
  }

  if (updateData.coachingExamId && updateData.coachingExamUpdate) {
    const oldExam = oldData.coachingDetails?.examDetails?.find(
      (e) => e._id.toString() === updateData.coachingExamId.toString()
    );
    const newExam = newData.coachingDetails?.examDetails?.find(
      (e) => e._id.toString() === updateData.coachingExamId.toString()
    );

    await trackEdit("coaching_exam_updated", oldExam, newExam);
  }

  if (Array.isArray(updateData.coachingExamUpdates)) {
    for (const { examId } of updateData.coachingExamUpdates) {
      const oldExam = oldData.coachingDetails?.examDetails?.find(
        (e) => e._id.toString() === examId.toString()
      );
      const newExam = newData.coachingDetails?.examDetails?.find(
        (e) => e._id.toString() === examId.toString()
      );

      await trackEdit("coaching_exam_updated", oldExam, newExam);
    }
  }

  if (updateData.mockTestId && updateData.mockTestUpdate) {
    const oldTest = oldData.coachingDetails?.mockTestDetails?.find(
      (m) => m._id.toString() === updateData.mockTestId.toString()
    );
    const newTest = newData.coachingDetails?.mockTestDetails?.find(
      (m) => m._id.toString() === updateData.mockTestId.toString()
    );

    await trackEdit("mock_test_updated", oldTest, newTest);
  }

  if (updateData.masterSessionId && updateData.masterSessionUpdate) {
    const oldSession = oldData.coachingDetails?.masterSessionDetails?.find(
      (s) => s._id.toString() === updateData.masterSessionId.toString()
    );
    const newSession = newData.coachingDetails?.masterSessionDetails?.find(
      (s) => s._id.toString() === updateData.masterSessionId.toString()
    );

    await trackEdit("master_session_updated", oldSession, newSession);
  }

  if (updateData.subjectLevelId && updateData.subjectLevelUpdate) {
    const oldSub = oldData.coachingDetails?.subjectLevelDetails?.find(
      (s) => s._id.toString() === updateData.subjectLevelId.toString()
    );
    const newSub = newData.coachingDetails?.subjectLevelDetails?.find(
      (s) => s._id.toString() === updateData.subjectLevelId.toString()
    );

    await trackEdit("subject_level_updated", oldSub, newSub);
  }

  if (updateData.interestedCourseId && updateData.interestedCourseUpdate) {
    const oldCourse = oldData.interestedCourseDetails?.find(
      (c) => c._id.toString() === updateData.interestedCourseId.toString()
    );
    const newCourse = newData.interestedCourseDetails?.find(
      (c) => c._id.toString() === updateData.interestedCourseId.toString()
    );

    await trackEdit("interested_course_updated", oldCourse, newCourse);
  }

  if (updateData.documentId && updateData.documentUpdate) {
    const oldDoc = oldData.uploadedDocumentDetails?.find(
      (d) => d._id.toString() === updateData.documentId.toString()
    );
    const newDoc = newData.uploadedDocumentDetails?.find(
      (d) => d._id.toString() === updateData.documentId.toString()
    );

    await trackEdit("document_updated", oldDoc, newDoc);
  }

  if (updateData.entranceExamId && updateData.entranceExamUpdate) {
    const oldCourse = oldData.entranceExamDetails?.find(
      (d) => d._id.toString() === updateData.entranceExamId.toString()
    );

    const newCourse = newData.entranceExamDetails?.find(
      (d) => d._id.toString() === updateData.entranceExamId.toString()
    );
    await trackEdit("entranceExam_detail_updated", oldCourse, newCourse);
  }

  if (updateData.aptitudeExamId && updateData.aptitudeExamUpdate) {
    const oldCourse = oldData.aptitudeExamDetails?.find(
      (c) => c._id.toString() === updateData.aptitudeExamId.toString()
    );
    const newCourse = newData.aptitudeExamDetails?.find(
      (c) => c._id.toString() === updateData.aptitudeExamId.toString()
    );
    await trackEdit("aptitudeExam_detail_updated", oldCourse, newCourse);
  }

  if (updateData.workExperienceId && updateData.workExperienceUpdate) {
    const oldCourse = oldData.workExperience?.find(
      (c) => c._id.toString() === updateData.workExperienceId.toString()
    );
    const newCourse = oldData.workExperience?.find(
      (c) => c._id.toString() === updateData.workExperienceId.toString()
    );
    await trackEdit("workExperience_updated", oldCourse, newCourse);
  }

  if (updateData.emergencyDetailsId && updateData.emergencyDetailsUpdate) {
    const oldCourse = oldData.emergencyDetails?.find(
      (c) => c._id.toString() === updateData.emergencyDetailsId.toString()
    );
    const newCourse = oldData.emergencyDetails?.find(
      (c) => c._id.toString() === updateData.emergencyDetailsId.toString()
    );
    await trackEdit("emergency_details_updated", oldCourse, newCourse);
  }

  if (
    updateData.personalDetailsRemarkId &&
    updateData.personalDetailsRemarksUpdate
  ) {
    const oldCourse = oldData.personalDetailsRemarks?.find(
      (c) => c._id.toString() === updateData.personalDetailsRemarkId.toString()
    );
    const newCourse = oldData.personalDetailsRemarks?.find(
      (c) => c._id.toString() === updateData.personalDetailsRemarkId.toString()
    );
    await trackEdit(
      "personalDetailsRemark_details_updated",
      oldCourse,
      newCourse
    );
  }

  // ---------------------------
  // 1️⃣ MAIN STATUS CHANGE
  // ---------------------------
  if (oldData.mainStatus?.toString() !== newData.mainStatus?._id?.toString()) {
    await pushEvent("main_status_changed", newData.mainStatus?.name);
  }

  // ---------------------------
  // 2️⃣ SUBMITTED TABS
  // ---------------------------
  if (updateData.submittedTabs) {
    await pushEvent("tab_submitted", updateData.submittedTabs);
  }

  if (Array.isArray(updateData.educationDetails)) {
    for (const edu of updateData.educationDetails) {
      if (edu.tempId) {
        const value = {
          degree: edu.degree || null,
          stream: edu.stream || null,
          boardOrUniversity: edu.boardOrUniversity || null,
          passingYear: edu.passingYear || null,
          score: edu.score || null,
          scoreOutOf: edu.scoreOutOf || null,
        };

        await pushEvent("education_detail_added", value);
      }
    }
  }

  if (Array.isArray(updateData.entranceExamDetails)) {
    for (const exam of updateData.entranceExamDetails) {
      if (exam.tempId || !exam._id) {
        const value = {
          testName: exam.testName || null,
          testDate: exam.testDate || null,
          expireDate: exam.expireDate || null,
          readScore: exam.readScore || null,
          writeScore: exam.writeScore || null,
          speakScore: exam.speakScore || null,
          listenScore: exam.listenScore || null,
          overallScore: exam.OverallScore || null,
        };

        await pushEvent("entranceExam_detail_added", value);
      }
    }
  }

  if (updateData.purposeDetails) {
    const oldPurpose = oldData.purposeDetails || {};
    const newPurpose = updateData.purposeDetails;

    if (!oldData.purposeDetails && newPurpose) {
      await pushEvent("purpose_details_updated", {
        inquiryFor: newPurpose.inquiryFor || null,
        preferredCountry: newPurpose.preferredCountry || [],
        intake: newPurpose.intake || null,
      });
    }

    if (oldData.purposeDetails) {
      if (
        JSON.stringify(oldPurpose.preferredCountry) !==
        JSON.stringify(newPurpose.preferredCountry)
      ) {
        await pushEvent("purpose_country_updated", {
          from: oldPurpose.preferredCountry || [],
          to: newPurpose.preferredCountry || [],
        });
      }

      if (oldPurpose.intake !== newPurpose.intake) {
        await pushEvent("purpose_intake_updated", {
          from: oldPurpose.intake || null,
          to: newPurpose.intake || null,
        });
      }
    }
  }

  if (Array.isArray(updateData.aptitudeExamDetails)) {
    for (const exam of updateData.aptitudeExamDetails) {
      if (exam.tempId || !exam._id) {
        const value = {
          testName: exam.testName || null,
          testDate: exam.testDate || null,
          expireDate: exam.expireDate || null,
          verbalReasoningScore: exam.verbalReasoningScore || null,
          quantitiveReasoningScore: exam.quantitiveReasoningScore || null,
          analyticalWritingScore: exam.analyticalWritingScore || null,
          overallScore: exam.overallScore || null,
        };

        await pushEvent("aptitude_exam_added", value);
      }
    }
  }

  if (Array.isArray(updateData.workExperience)) {
    for (const work of updateData.workExperience) {
      if (work.tempId || !work._id) {
        const value = {
          company: work.company || null,
          companyAddress: work.companyAddress || null,
          designation: work.designation || null,
          jobType: work.jobType || null,
        };

        await pushEvent("work_experience_added", value);
      }
    }
  }

  if (Array.isArray(updateData.personalDetailsRemarks)) {
    for (const remark of updateData.personalDetailsRemarks) {
      if (remark.tempId || !remark._id) {
        const value = {
          remark: remark.remark || null,
        };

        await pushEvent("personal_remark_added", value);
      }
    }
  }

  if (Array.isArray(updateData.emergencyDetails)) {
    for (const emergency of updateData.emergencyDetails) {
      if (emergency.tempId || !emergency._id) {
        const value = {
          personName: emergency.personName || null,
          contactNum: emergency.contactNum || null,
          email: emergency.email || null,
          relationShip: emergency.relationShip || null,
        };
        await pushEvent("emergency_detail_added", value);
      }
    }
  }

  if (Array.isArray(updateData.uploadedDocumentDetails)) {
    for (const doc of updateData.uploadedDocumentDetails) {
      if (doc.tempId || !doc._id) {
        let documentName = doc.customDocumentName || null;
        if (!documentName && doc.documentName) {
          try {
            if (mongoose.Types.ObjectId.isValid(doc.documentName)) {
              const d = await Documents.findById(doc.documentName).select(
                "name"
              );
            } else {
              documentName = doc.documentName;
            }
          } catch {
            documentName = doc.documentName;
          }
        }

        let documentType = null;
        if (doc.documentType) {
          try {
            const dt = await DocumentType.findById(doc.documentType).select(
              "name"
            );
            documentType = dt?.name || doc.documentType;
          } catch {
            documentType = doc.documentType;
          }
        }

        const value = {
          documentName,
          documentType,
          status: doc.status || "uploaded",
          remarks: doc.remarks || null,
          deadline: doc.deadline || null,
          refModule: doc.ref_module || null,
        };
        await pushEvent("document_added", value);
      }
    }
  }

  // ---------------------------
  // 3️⃣ INTERESTED COURSE DETAILS
  // ---------------------------
  if (Array.isArray(updateData.interestedCourseDetails)) {
    for (const item of updateData.interestedCourseDetails) {
      const oldCourse = oldData.interestedCourseDetails.find(
        (c) => c._id?.toString() === item._id?.toString()
      );

      // New application added
      if (!item._id) {
        // Clone item object
        const full = { ...item };

        // Fetch all names in parallel
        const [institute, campus, course, programLevel] = await Promise.all([
          Institute.findById(item.institute).select("instituteName"),
          Campus.findById(item.campus).select("campus"),
          Course.findById(item.course).select("programName"),
          ProgramLevel.findById(item.programLevel).select("name"),
        ]);

        full.institute = institute?.instituteName || null;
        full.campus = campus?.campus || null;
        full.course = course?.programName || null;
        full.programLevel = programLevel?.name || null;

        delete full.tempId; // optional

        await pushEvent("course_added", full);
        continue;
      }
    }
  }

  // ------------------------------------------------------
  // PART B: Handle updates in interestedCourseUpdate
  // ------------------------------------------------------
  if (updateData.interestedCourseId && updateData.interestedCourseUpdate) {
    const updated = updateData.interestedCourseUpdate;

    const oldCourse = oldData.interestedCourseDetails.find(
      (c) => c._id.toString() === updateData.interestedCourseId.toString()
    );

    if (!oldCourse) {
      console.warn("Course not found for tracking");
      return;
    }

    // ---------------------------
    // 1️⃣ Status change
    // ---------------------------
    if (updated.status && updated.status !== oldCourse.status) {
      await pushEvent("course_status_changed", updated.status);
    }

    // ---------------------------
    // 2️⃣ Application Submission
    // ---------------------------
    // if (updated.applicationSubmissionForm &&
    //     updated.applicationSubmissionForm !== oldCourse.applicationSubmissionForm) {

    //     await pushEvent("application_submission", updated.applicationSubmissionForm);
    // }

    // ---------------------------
    // 3️⃣ Interview Scheduling (store full object)
    // ---------------------------
    if (updated.interviewScheduling) {
      const is = updated.interviewScheduling;

      let interviewObject = {
        type: is.type,
      };

      if (is.type === "single") {
        interviewObject.singleInterview = {
          dateTime: is.singleInterview?.dateTime || null,
          mode: is.singleInterview?.mode || null,
          meetingLink: is.singleInterview?.meetingLink || null,
        };
      }

      if (is.type === "multi") {
        interviewObject.multiRoundInterview = is.multiRoundInterview || [];
      }

      await pushEvent("interview_scheduled", interviewObject);
    }

    // ---------------------------
    // 4️⃣ Offer Letter
    // ---------------------------
    // 4️⃣ Offer Letter Received
    if (updated.offerLetterReceived) {
      const type = updated.offerLetterType || oldCourse.offerLetterType || null;

      const eventName = type
        ? `${type.toLowerCase().replace(/\s+/g, "_")}_offer_letter_received`
        : "offer_letter_received";

      const offerData = {
        received: true,
        type,
        remarks: updated.offerLetterRemarks || null,
      };

      await pushEvent(eventName, offerData);
    }

    if (updated.offerLetterAcceptedByStudent) {
      await pushEvent(
        "offer_letter_acceptance",
        updated.offerLetterAcceptedByStudent
      );
    }

    // ---------------------------
    // 5️⃣ Deposit Payment Paid
    // ---------------------------
    if (updated.depositPayment?.feeStatus) {
      await pushEvent("deposit_payment", updated.depositPayment);
    }

    // ---------------------------
    // 6️⃣ Institute Fee Paid
    // ---------------------------
    if (updated.instituteFeePayment?.feeStatus) {
      await pushEvent("institute_fee", updated.instituteFeePayment);
    }
  }

  // ---------------------------
  // 4️⃣ COACHING DETAILS
  // ---------------------------
  if (updateData.coachingRequirement) {
    await pushEvent("coachingRequirement", updateData.coachingRequirement);
  }

  if (updateData.registerFor) {
    await pushEvent("registerFor", updateData.registerFor);
  }

  if (updateData.examRegistrationDate) {
    await pushEvent("exam_Registration_Date", updateData.examRegistrationDate);
  }

  if (updateData.remarkHistory) {
    await pushEvent("coaching_Remark_History", updateData.remarkHistory);
  }

  // ---------------------------
  // 5️⃣ USER ALLOCATION
  // ---------------------------
  if (
    updateData.userAllocationDetails &&
    Array.isArray(updateData.userAllocationDetails)
  ) {
    const alloc = updateData.userAllocationDetails[0]; // take first item

    if (alloc) {
      // populate role & user
      const [role, user] = await Promise.all([
        Role.findById(alloc.role).select("name"),
        User.findById(alloc.user).select("name"),
      ]);

      const value = {
        role: {
          _id: alloc.role,
          name: role?.name || null,
        },
        user: {
          _id: alloc.user,
          name: user?.name || null,
        },
      };

      await pushEvent("user_allocation", value);
    }
  }

  // ---------------------------
  // 5️ VISA ALLOCATION
  // ---------------------------
  if (
    updateData.visaAllocationDetails &&
    Array.isArray(updateData.visaAllocationDetails)
  ) {
    const alloc = updateData.visaAllocationDetails[0]; // take first item

    if (alloc) {
      // populate role & user
      const [role, user] = await Promise.all([
        Role.findById(alloc.role).select("name"),
        User.findById(alloc.user).select("name"),
      ]);

      const value = {
        role: {
          _id: alloc.role,
          name: role?.name || null,
        },
        user: {
          _id: alloc.user,
          name: user?.name || null,
        },
      };

      await pushEvent("visa_allocation", value);
    }
  }

  // ---------------------------
  // 6️⃣ VISA APPLICATION DETAILS
  // ---------------------------
  //   if (updateData.visaApplicationDetails) {
  //     const v = updateData.visaApplicationDetails;

  //     if (v.status) {
  //       await pushEvent("visa_status_changed", v.status);
  //     }

  //     if (v.biometricsUploaded) {
  //       await pushEvent("biometrics_completed", "Completed");
  //     }

  //     if (v.visaOutcomeStatus) {
  //       await pushEvent("visa_outcome", v.visaOutcomeStatus);
  //     }
  //   }

  if (updateData.visaApplicationDetails) {
    let country =
      oldData.purposeDetails.preferredCountry[0] ||
      newData.purposeDetails.preferredCountry[0];

    country = normalizeCountry(country);

    if (country && visaProcessHistory[country]) {
      const steps = visaProcessHistory[country];
      const updatedFlow = updateData.visaApplicationDetails;
      const oldFlow = oldData.visaApplicationDetails || {};

      for (const step of steps) {
        if (updatedFlow[step]) {
          const newValue = updatedFlow[step];
          const oldValue = oldFlow[step];

          const isChanged =
            JSON.stringify(newValue) !== JSON.stringify(oldValue);

          if (isChanged) {
            await pushEvent("visa_step_update", {
              // country,
              step,
              data: newValue,
            });
          }
        }
      }
    }
  }

  // document process history
  if (newData._triggeredDocument) {
    const doc = newData._triggeredDocument;

    let documentName = doc.customDocumentName || null;

    if (!documentName && doc.documentName) {
      try {
        const d = await Documents.findById(doc.documentName).select("name");
        documentName = d?.name || doc.documentName;
      } catch {
        documentName = doc.documentName;
      }
    }

    let documentType = null;

    if (doc.documentType) {
      try {
        const dt = await DocumentType.findById(doc.documentType).select("name");
        documentType = dt?.name || doc.documentType;
      } catch {
        documentType = doc.documentType;
      }
    }

    const value = {
      documentName,
      documentType: documentType,
      status: doc.status || "uploaded",
      remarks: doc.remarks || null,
      filePath: doc.filePath || null,
      refModule: doc.ref_module || null,
    };

    await pushEvent("document_uploaded", value);
  }

  if (newData._triggeredDocumentStatus) {
    const d = newData._triggeredDocumentStatus;

    if (d.oldStatus !== d.newStatus) {
      let documentName = d.documentName;

      if (documentName && mongoose.Types.ObjectId.isValid(documentName)) {
        try {
          const doc = await Documents.findById(documentName).select("name");
          documentName = doc?.name || documentName;
        } catch {}
      }

      const value = {
        documentName,
        oldStatus: d.oldStatus,
        newStatus: d.newStatus,
        remarks: d.remarks || null,
      };

      await pushEvent("document_status_changed", value);
    }
  }

  // ---------------------------
  // SAVE TRACKING
  // ---------------------------
  if (events.length > 0) {
    await ProcessHistory.updateOne(
      { studentId },
      { $push: { history: { $each: events } } },
      { upsert: true }
    );
  }
}

const addMailHistory = async ({
  studentId,
  event,
  value,
  userId = null,
  userName = "SYSTEM",
}) => {
  await ProcessHistory.updateOne(
    { studentId }, // ✅ ObjectId only
    {
      $push: {
        history: {
          event,
          value,
          updatedBy: userId,
          updatedByName: userName,
          date: new Date(),
        },
      },
    },
    { upsert: true }
  );
};

module.exports = { trackStudentEvents, addMailHistory };
