const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const visitorApplication = require("../../../model/visitorApplication/visitorApplication");
const VisaStatus = require("../../../model/masters/visaStatus");
const visitorStatus = require("../../../model/visitorApplication/visitorStatus");
const User = require("../../../model/user");
const Document = require("../../../model/masters/documentList/visitor/visitorDocument");
const B2BMember = require("../../../model/masters/b2b/b2bMember");
const B2BAdmin = require("../../../model/masters/b2b/b2bAdmin");
const BranchMember = require("../../../model/branch/branchMember");
const Role = require("../../../model/masters/roles");

const touristDocument = require("../../../model/masters/documentList/touristDocument");
const Documents = require("../../../model/masters/documentList/documents");
const DocumentTypes = require("../../../model/masters/documentList/documentType");
const GenerateInvoice = require("../../../model/generateInvoice");

const paginate = require("../../../utils/pagination");

const { getVisitorNextSequence } = require("../../../helpers/nextIdSequence");
const { uploadToCloudinary } = require("../../../middleware/cloudinary");
const { getEmailRecipient } = require("../../../helpers/getRecipientDetails");
const {
  sendVisitorWelcomeEmail,
  sendNewStudentApplicationEmail,
  sendPendingDocsVisitorEmail,
  sendDocumentReuploadEmail,
  sendApplicationStatusUpdateEmail,
  sendVisaStatusUpdateEmail,
  sendNewEligibleStudentEmail,
  sendUniversityCommissionStatusEmail,
  sendB2BCommissionStatusEmail,
  sendStudentAssignToFacultyEmail,
} = require("../../../middleware/nodemailer");

const { sendSingleMessage } = require("../waDaddy/campaign");

const visitorApplicationServices = {
  create: async (data, userId, userName, userType, b2bName, branch) => {
    const { email } = data;

    let invoice = null;
    if (data.invoice) {
      try {
        invoice = JSON.parse(data.invoice);
      } catch (err) {
        console.error("❌ Error parsing invoice JSON:", err);
      }
    }

    const existingEmail = await visitorApplication.findOne({ email });
    if (existingEmail) {
      throw { status: false, message: "Email already exists" };
    }

    data.created_by = userId;
    data.createdByName = userName;
    data.created_by_type = userType;

    if (b2bName) data.b2bCompany = b2bName;
    if (branch) data.branch = branch;

    data.visitorId = await getVisitorNextSequence("visitorId", "VT");

    const newVisitor = new visitorApplication(data);
    await newVisitor.save();

    // Fire-and-forget background tasks
    (async () => {
      try {
        const tasks = [];

        if (userType !== "B2B Admin" && userType !== "B2B Member") {
          if (newVisitor.email) {
            tasks.push(
              sendVisitorWelcomeEmail(
                newVisitor.email,
                newVisitor.name,
                newVisitor.preferredCountry
              ),
              sendSingleMessage({
                to: newVisitor.contact,
                templateId: null,
                templateName: "visitor_visa_welcome1",
                fromNumberId: "917359266930",
                languageCode: "en",
                parameters: {
                  body: [newVisitor.name, newVisitor.preferredCountry],
                },
              })
            );
          }
        }

        if (invoice) {
          tasks.push(
            GenerateInvoice.create({
              ...invoice,
              name: newVisitor._id,
              contactNo: newVisitor.contact,
              created_by: userId,
              createdByName: userName,
            })
          );
        }

        await Promise.all(tasks);
      } catch (bgError) {
        console.error("Visitor background tasks failed:", bgError);
      }
    })();

    return newVisitor;
  },
  update: async (
    updateId,
    updateData,
    userId,
    userName,
    files,
    categoryDoc
  ) => {
    if (
      updateData &&
      updateData.updateData &&
      typeof updateData.updateData === "string"
    ) {
      try {
        const parsedData = JSON.parse(updateData.updateData);

        updateData = parsedData;
      } catch (error) {
        // console.error("Error parsing updateData:", error);
        throw { status: false, message: "Invalid JSON in updateData" };
      }
    }

    const { email, documentType, documentName } = updateData;

    if (email) {
      const existingEmail = await visitorApplication.findOne({
        _id: { $ne: updateId },
        email,
      });

      if (existingEmail) {
        throw { status: false, message: "Email already exists" };
      }
    }

    const validFollowUpTabs = [
      "personalDetails",
      "documentDetails",
      // "interestedCourse",
      "visaApplication",
    ];

    const visitor = await visitorApplication.findById(updateId);
    if (!visitor) throw { status: false, message: "Visitor not found" };

    if (updateData.submittedTabs) {
      const tab = updateData.submittedTabs;

      if (!Array.isArray(visitor.submittedTabs)) {
        visitor.submittedTabs = [];
      }

      if (!visitor.submittedTabs.includes(tab)) {
        visitor.submittedTabs.push(tab);
      }
    }

    if (updateData.followUps && typeof updateData.followUps === "object") {
      for (const tabKey of validFollowUpTabs) {
        const tabFollowUp = updateData.followUps[tabKey];

        if (tabFollowUp && typeof tabFollowUp === "object") {
          const { status, nextFollowUpDate, remarks } = tabFollowUp;

          // Initialize if not present
          if (!visitor.followUps) {
            visitor.followUps = {};
          }
          if (!visitor.followUps[tabKey]) {
            visitor.followUps[tabKey] = {};
          }

          if (status) {
            visitor.followUps[tabKey].status = status;
          }
          if (nextFollowUpDate) {
            visitor.followUps[tabKey].nextFollowUpDate = new Date(
              nextFollowUpDate
            );
          }
          if (remarks !== undefined) {
            visitor.followUps[tabKey].remarks = remarks;
          }
        }
      }
    }

    let lastUpdatedField = null;
    const updatableFields = [
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
      "preferredCountry",
      "personalDetailStatus",
      "documentDetailStatus",
      "mainStatus",
    ];
    for (const field of updatableFields) {
      if (updateData[field] !== undefined) {
        visitor[field] = updateData[field];
      }
    }
    updatableFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (
          field === "personalDetailStatus" ||
          field === "documentDetailStatus" ||
          field === "counsellingDetailStatus"
        ) {
          lastUpdatedField = field;
        }
      }
    });

    if (lastUpdatedField) {
      visitor.lastUpdatedStatus = updateData[lastUpdatedField];
    }

    const { customDocumentName, status, remarks } = updateData;

    const tempIdMap = new Map();

    if (Array.isArray(updateData.educationDetails)) {
      updateData.educationDetails.forEach((eduDetail) => {
        if (eduDetail.tempId) {
          // Generate a consistent ObjectId for this tempId
          const objectId = new mongoose.Types.ObjectId();

          // Store mapping
          tempIdMap.set(eduDetail.tempId, objectId);

          // Add _id to the education detail
          eduDetail._id = objectId;
        }
      });
    }

    if (Array.isArray(updateData.educationDetails)) {
      for (const eduDetail of updateData.educationDetails) {
        if (eduDetail._id && !eduDetail.tempId) {
          // This is an existing education detail
          const index = visitor.educationDetails.findIndex(
            (i) => i._id.toString() === eduDetail._id.toString()
          );

          if (index !== -1) {
            // Update existing
            const existing = visitor.educationDetails[index].toObject();
            visitor.educationDetails[index] = {
              ...existing,
              ...eduDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          // This is a new education detail
          visitor.educationDetails.push({
            ...eduDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (Array.isArray(updateData.entranceExamDetails)) {
      updateData.entranceExamDetails.forEach((entDetail) => {
        if (entDetail.tempId) {
          const objectId = new mongoose.Types.ObjectId();

          tempIdMap.set(entDetail.tempId, objectId);
          entDetail._id = objectId;
        }
      });
    }

    if (Array.isArray(updateData.entranceExamDetails)) {
      for (const entDetail of updateData.entranceExamDetails) {
        if (entDetail._id && !entDetail.tempId) {
          const index = visitor.entranceExamDetails.findIndex(
            (i) => i._id.toString() === entDetail._id.toString()
          );

          if (index !== -1) {
            const existing = visitor.entranceExamDetails[index].toObject();
            visitor.entranceExamDetails[index] = {
              ...existing,
              ...entDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          visitor.entranceExamDetails.push({
            ...entDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (Array.isArray(updateData.aptitudeExamDetails)) {
      updateData.aptitudeExamDetails.forEach((aptDetail) => {
        if (aptDetail.tempId) {
          const objectId = new mongoose.Types.ObjectId();

          tempIdMap.set(aptDetail.tempId, objectId);

          aptDetail._id = objectId;
        }
      });
    }

    if (Array.isArray(updateData.aptitudeExamDetails)) {
      for (const aptDetail of updateData.aptitudeExamDetails) {
        if (aptDetail._id && !aptDetail.tempId) {
          const index = visitor.aptitudeExamDetails.findIndex(
            (i) => i._id.toString() === aptDetail._id.toString()
          );

          if (index !== -1) {
            const existing = visitor.aptitudeExamDetails[index].toObject();
            visitor.aptitudeExamDetails[index] = {
              ...existing,
              ...aptDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          visitor.aptitudeExamDetails.push({
            ...aptDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    // add
    if (updateData.categoryDetails) {
      if (!Array.isArray(visitor.categoryDetails)) {
        visitor.categoryDetails = [];
      }

      let docUrl = null;
      // if (categoryDoc) {
      //   const cloudinaryRes = await uploadToCloudinary(
      //     categoryDoc[0].buffer,
      //     categoryDoc[0].mimetype,
      //     "categoryDoc"
      //   );

      //   docUrl = cloudinaryRes.secure_url;
      // }

      if (categoryDoc && categoryDoc.length > 0) {
        const fullPath = categoryDoc[0].path; // multer gives full local file path

        // ✅ Extract relative path starting from "uploads"
        const uploadIndex = fullPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath;

        // ✅ Assign final path to docUrl
        docUrl = relativePath;
      }
      updateData.categoryDetails.forEach((cd) => {
        visitor.categoryDetails.push({
          ...cd,
          document: docUrl,
          created_by: userId,
          createdByName: userName,
        });
      });
    }

    //update
    if (updateData.categoryId && updateData.categoryUpdate) {
      const index = visitor.categoryDetails.findIndex(
        (i) => i._id.toString() === updateData.categoryId.toString()
      );

      if (index !== -1) {
        const existingDoc = visitor.categoryDetails[index].toObject();
        visitor.categoryDetails[index] = {
          ...existingDoc,
          ...updateData.categoryUpdate,
        };
      }
    }

    //dc update
    if (updateData.categoryId) {
      if (categoryDoc) {
        const fullPath = categoryDoc[0].path; // multer gives full local file path

        // Extract relative path starting from "uploads"
        const uploadIndex = fullPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath;

        // Assign final path to docUrl
        const docUrl = relativePath;

        const index = visitor.categoryDetails.findIndex(
          (i) => i._id.toString() === updateData.categoryId.toString()
        );

        const existingDoc = visitor.categoryDetails[index].toObject();

        visitor.categoryDetails[index] = {
          ...existingDoc,
          document: docUrl, // ✅ Use the string path directly
        };
      }
    }

    if (Array.isArray(updateData.workExperience)) {
      updateData.workExperience.forEach((workDetail) => {
        if (workDetail.tempId) {
          const objectId = new mongoose.Types.ObjectId();

          tempIdMap.set(workDetail.tempId, objectId);

          workDetail._id = objectId;
        }
      });
    }
    if (Array.isArray(updateData.workExperience)) {
      for (const workDetail of updateData.workExperience) {
        if (workDetail._id && !workDetail.tempId) {
          const index = visitor.workExperience.findIndex(
            (i) => i._id.toString() === workDetail._id.toString()
          );

          if (index !== -1) {
            const existing = visitor.workExperience[index].toObject();
            visitor.workExperience[index] = {
              ...existing,
              ...workDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          visitor.workExperience.push({
            ...workDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (files) {
      for (const file of files) {
        let finalDocName = documentName;

        if (documentName && !customDocumentName) {
          try {
            const doc = await Documents.findById(documentName).lean();
            if (doc) {
              finalDocName = doc.name;
            } else {
              // Not found in Document table — assume it's a raw string and use as-is
              finalDocName = documentName;
            }
          } catch (err) {
            // In case documentName is not a valid ObjectId (e.g., plain string), fallback
            finalDocName = documentName;
          }
        }
        finalDocName = customDocumentName || finalDocName;

        // if (mongoose.Types.ObjectId.isValid(finalDocName)) {
        //   finalDocName = await Document.findById(finalDocName).select("name");
        // }

        // const ext = path.extname(file.originalname);
        // const finalvisitorName = visitor?.name
        //   ?.replace(/\s+/g, "_")
        //   .toLowerCase();
        // const safeDocName = finalDocName?.replace(/\s+/g, "_").toLowerCase();
        // const now = new Date();
        // const dateTimeString = now.toISOString().replace(/[:.]/g, "-"); // e.g., 2025-06-02T14-30-15-123Z

        // // const newFileName = `${finalvisitorName}_${safeDocName}_${dateTimeString}${ext}`;

        // const sanitizePublicId = (name) =>
        //   name
        //     .replace(/\.[^/.]+$/, "") // remove file extension
        //     .replace(/[\/\\?%*:|"<>()[\]{}&]/g, "") // remove illegal/special characters
        //     .replace(/\s+/g, "_") // replace whitespace with _
        //     .toLowerCase();

        // const cloudinaryPublicId = sanitizePublicId(
        //   `${finalvisitorName}_${safeDocName}_${dateTimeString}`
        // );

        // const cloudinaryRes = await uploadToCloudinary(
        //   file.buffer,
        //   file.mimetype,
        //   "visitor-documents",
        //   cloudinaryPublicId
        // );

        // const cloudFilePath = cloudinaryRes.secure_url;

        const uploadDir = path.join(
          __dirname,
          "../../../uploads/visitor-documents"
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const finalStudentName = visitor?.name
          ?.replace(/\s+/g, "_")
          .toLowerCase();
        const safeDocName = finalDocName?.replace(/\s+/g, "_").toLowerCase();
        const now = new Date();
        const dateTimeString = now.toISOString().replace(/[:.]/g, "-");

        const sanitizePublicId = (name) =>
          name
            .replace(/\.[^/.]+$/, "") // remove file extension
            .replace(/[\/\\?%*:|"<>()[\]{}&]/g, "") // remove illegal/special characters
            .replace(/\s+/g, "_") // replace whitespace with _
            .toLowerCase();

        // ✅ Build safe file name
        const sanitizedName = sanitizePublicId(
          `${finalStudentName}_${safeDocName}_${dateTimeString}`
        );

        const ext = path.extname(file.originalname) || "";

        // ✅ Final file name and path
        const newFileName = `${sanitizedName}${ext}`;
        const oldPath = file.path;
        const newPath = path.join(uploadDir, newFileName);

        // ✅ Move file to new location
        fs.renameSync(oldPath, newPath);

        // ✅ Generate relative path for DB
        const uploadIndex = newPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? newPath.substring(uploadIndex).replace(/\\/g, "/")
            : newPath;

        // ✅ Assign final path
        const cloudFilePath = relativePath;

        let ref_module = null;
        if (
          updateData.educationDetailTempId &&
          tempIdMap.has(updateData.educationDetailTempId)
        ) {
          ref_module = tempIdMap.get(updateData.educationDetailTempId);
        } else if (
          updateData.entranceExamTempId &&
          tempIdMap.has(updateData.entranceExamTempId)
        ) {
          ref_module = tempIdMap.get(updateData.entranceExamTempId);
        } else if (
          updateData.aptitudeExamTempId &&
          tempIdMap.has(updateData.aptitudeExamTempId)
        ) {
          ref_module = tempIdMap.get(updateData.aptitudeExamTempId);
        } else if (
          updateData.workTempId &&
          tempIdMap.has(updateData.workTempId)
        ) {
          ref_module = tempIdMap.get(updateData.workTempId);
        } else if (updateData.workExperienceId) {
          ref_module = updateData.workExperienceId;
        } else if (updateData.aptitudeExamId) {
          ref_module = updateData.aptitudeExamId;
        } else if (updateData.educationDetailId) {
          ref_module = updateData.educationDetailId;
        } else if (updateData.entranceExamId) {
          ref_module = updateData.entranceExamId;
        } else if (
          updateData.customDocumentName &&
          (updateData.customDocumentName === "Application Submission Form" ||
            updateData.customDocumentName === "Fee Payment Proof" ||
            updateData.customDocumentName === "Conditional Offer Letter" ||
            updateData.customDocumentName === "Unconditional Offer Letter" ||
            updateData.customDocumentName === "Compulsory Agreement Document" ||
            updateData.customDocumentName === "Visa Fee Payment" ||
            updateData.customDocumentName === "Appointment Letter" ||
            updateData.customDocumentName === "Biometrics Receipt" ||
            updateData.customDocumentName === "PIC Decision" ||
            updateData.customDocumentName === "D Visa Document" ||
            updateData.customDocumentName === "Supplementary Additional" ||
            updateData.customDocumentName === "Visa Application Submission" ||
            updateData.customDocumentName === "Visa Outcome Proof" ||
            updateData.customDocumentName === "Commission payment Proof" ||
            updateData.customDocumentName === "Balance Certificate")
        ) {
          ref_module = updateData.ref_module;
        }

        // ✅ Handle Reupload update logic here
        if (updateData.documentId) {
          const index = visitor.uploadedDocumentDetails.findIndex(
            (doc) => doc._id.toString() === updateData.documentId.toString()
          );

          if (index !== -1) {
            const existing = visitor.uploadedDocumentDetails[index].toObject();

            if (existing.status === "Reupload") {
              // if (existing.filePath) {
              //   try {
              //     fs.unlinkSync(existing.filePath);
              //   } catch (err) {
              //     console.error("Error deleting old file:", err);
              //   }
              // }
              visitor.uploadedDocumentDetails[index] = {
                ...existing,
                filePath: cloudFilePath,
                status: "unverified",
                updated_by: userId,
                updatedByName: userName,
              };
            } else {
              throw {
                status: false,
                message:
                  "Cannot reupload unless the current status is 'Reupload'",
              };
            }
          } else {
            throw {
              status: false,
              message: "Invalid documentId provided for reupload",
            };
          }
        } else {
          // ✅ Fresh document upload flow
          if ((documentType && documentName) || customDocumentName) {
            visitor.uploadedDocumentDetails?.push({
              documentType: documentType || null,
              documentName: documentName || null,
              customDocumentName: customDocumentName || null,
              status: status || null,
              remarks: remarks || null,
              filePath: cloudFilePath,
              created_by: userId,
              createdByName: userName,
              updated_by: userId,
              updatedByName: userName,
              ref_module: ref_module || null,
            });

            if (
              (customDocumentName || finalDocName) ===
              "Compulsory Agreement Document"
            ) {
              for (const courseDetail of visitor.interestedCourseDetails) {
                if (courseDetail.typeOfApplication === "Tailormade") {
                  let status = await InterestedCourseStatus.findOne({
                    name: "Application Initiated",
                  });
                  if (!status) {
                    status = await InterestedCourseStatus.create({
                      name: "Application Initiated",
                    });
                  }

                  courseDetail.status = status.name;
                  courseDetail.updated_by = userId;
                  courseDetail.updatedByName = userName;
                }
              }
            }
          } else {
            throw {
              status: false,
              message:
                "Document must have either (documentType & documentName) or customDocumentName",
            };
          }
        }
      }
    }

    if (updateData.educationDetailId && updateData.educationDetailUpdate) {
      const index = visitor.educationDetails.findIndex(
        (ed) => ed._id.toString() === updateData.educationDetailId.toString()
      );
      if (index !== -1) {
        const existing = visitor.educationDetails[index].toObject();
        visitor.educationDetails[index] = {
          ...existing,
          ...updateData.educationDetailUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };

        if (updateData.educationDocumentUpdate) {
          const existingDoc =
            visitor.uploadedDocumentDetails[docIndex].toObject();
          visitor.uploadedDocumentDetails[docIndex] = {
            ...existingDoc,
            ...updateData.educationDocumentUpdate,
            updated_by: userId,
            updatedByName: userName,
          };
        }
      }
    }

    if (updateData.entranceExamId && updateData.entranceExamUpdate) {
      const index = visitor.entranceExamDetails.findIndex(
        (e) => e._id.toString() === updateData.entranceExamId.toString()
      );
      if (index !== -1) {
        const existing = visitor.entranceExamDetails[index].toObject();
        visitor.entranceExamDetails[index] = {
          ...existing,
          ...updateData.entranceExamUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };

        if (updateData.entranceExamDocumentUpdate) {
          const existingDoc = visitor.uploadedDocumentDetails[index].toObject();
          visitor.uploadedDocumentDetails[docIndex] = {
            ...existingDoc,
            ...updateData.entranceExamDocumentUpdate,
            updated_by: userId,
            updatedByName: userName,
          };
        }
      }
    }

    if (updateData.aptitudeExamId && updateData.aptitudeExamUpdate) {
      const index = visitor.aptitudeExamDetails.findIndex(
        (e) => e._id.toString() === updateData.aptitudeExamId.toString()
      );
      if (index !== -1) {
        const existing = visitor.aptitudeExamDetails[index].toObject();
        visitor.aptitudeExamDetails[index] = {
          ...existing,
          ...updateData.aptitudeExamUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (updateData.workExperienceId && updateData.workExperienceUpdate) {
      const index = visitor.workExperience.findIndex(
        (e) => e._id.toString() === updateData.workExperienceId.toString()
      );
      if (index !== -1) {
        const existing = visitor.workExperience[index].toObject();
        visitor.workExperience[index] = {
          ...existing,
          ...updateData.workExperienceUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    // Handle uploaded document details
    if (
      updateData.uploadedDocumentDetails &&
      Array.isArray(updateData.uploadedDocumentDetails)
    ) {
      for (const doc of updateData.uploadedDocumentDetails) {
        if (doc._id) {
          // This is an update to an existing document
          const existingIndex = visitor.uploadedDocumentDetails.findIndex(
            (existingDoc) => existingDoc._id.toString() === doc._id.toString()
          );

          if (existingIndex !== -1) {
            // Partial update - only update the fields that are provided
            const existingDoc =
              visitor.uploadedDocumentDetails[existingIndex].toObject();
            visitor.uploadedDocumentDetails[existingIndex] = {
              ...existingDoc, // Keep all existing fields
              ...doc, // Apply only the fields that are provided in the update
              created_by: existingDoc.created_by,
              createdByName: existingDoc.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          // This is a new document, push it
          visitor.uploadedDocumentDetails?.push({
            ...doc,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    // Direct subdocument update by ID
    if (updateData.documentId && updateData.documentUpdate) {
      const index = visitor.uploadedDocumentDetails.findIndex(
        (doc) => doc._id.toString() === updateData.documentId.toString()
      );

      if (index !== -1) {
        const existing = visitor.uploadedDocumentDetails[index].toObject();
        if (updateData.documentUpdate.status === "Reupload") {
          existing.filePath = "";

          const getDocumentName = await Documents.findById(
            existing.documentName
          );
          const getDocumentType =
            (await DocumentTypes.findById(existing.documentType)) ||
            existing.documentType;

          let recipientEmail = visitor.email;
          let recipientType = "visitor";

          if (visitor.created_by_type === "B2B Admin") {
            const b2bAdmin = await B2BAdmin.findById(visitor.created_by).select(
              "email"
            );
            if (b2bAdmin?.email) {
              recipientEmail = b2bAdmin.email;
              recipientType = "B2B";
            }
          } else if (visitor.created_by_type === "B2B Member") {
            const b2bMember = await B2BMember.findById(
              visitor.created_by
            ).select("email");
            if (b2bMember?.email) {
              recipientEmail = b2bMember.email;
              recipientType = "B2B";
            }
          }

          // await sendDocumentReuploadEmail(
          //   recipientEmail,
          //   getDocumentName?.name,
          //   getDocumentType?.name || "",
          //   visitor.name,
          //   visitor.visitorId,
          //   recipientType
          // );
        }

        if (
          existing.status === "Reupload" &&
          updateData.documentUpdate.filePath
        ) {
          existingfilePath = updateData.documentUpdate;
        }

        visitor.uploadedDocumentDetails[index] = {
          ...existing,
          ...updateData.documentUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    const sendAllocationEmail = async (userId, student) => {
      try {
        const user = await User.findById(userId).populate("role", "name");

        if (user) {
          const visitorName = `${visitor.name}`;
          const b2bPartnerName =
            visitor.b2bCompany || visitor.createdByName || "B2B Partner";
          const senderName = b2bPartnerName;
          const companyName = "Kurm Infotech";

          await sendNewStudentApplicationEmail(
            user.email,
            user.name,
            visitorName,
            b2bPartnerName,
            senderName,
            companyName,
            user.role.name
          );
        }
      } catch (error) {
        console.error("Error sending allocation email:", error);
      }
    };

    // user allocation handle

    if (
      updateData.userAllocationDetails &&
      Array.isArray(updateData.userAllocationDetails)
    ) {
      for (const userDetail of updateData.userAllocationDetails) {
        if (userDetail._id) {
          const existingIndex = visitor.userAllocationDetails.findIndex(
            (e) => e._id.toString() === userDetail._id.toString()
          );
          if (existingIndex !== -1) {
            const existingData =
              visitor.userAllocationDetails[existingIndex].toObject();
            visitor.userAllocationDetails[existingIndex] = {
              ...existingData,
              ...userDetail,
              created_by: existingData.created_by,
              createdByName: existingData.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          visitor.userAllocationDetails?.push({
            ...userDetail,
            created_by: userId,
            createdByName: userName,
          });

          await sendAllocationEmail(userDetail.user, visitor);
        }
      }
    }

    if (updateData.userAllocationId && updateData.userAllocationUpdate) {
      const index = visitor.userAllocationDetails.findIndex(
        (e) => e._id.toString() === updateData.userAllocationId.toString()
      );

      if (index !== -1) {
        const existingData = visitor.userAllocationDetails[index].toObject();

        visitor.userAllocationDetails[index] = {
          ...existingData,
          ...updateData.userAllocationUpdate,
          created_by: existingData.created_by,
          createdByName: existingData.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    //visa allocation handle

    if (
      updateData.visaAllocationDetails &&
      Array.isArray(updateData.visaAllocationDetails)
    ) {
      for (const userDetail of updateData.visaAllocationDetails) {
        visitor.visaAllocationDetails?.push({
          ...userDetail,
          created_by: userId,
          createdByName: userName,
        });

        if (visitor.visaAllocationDetails?.length === 1) {
          let visaStatus = await VisaStatus.findOne({
            name: "Visa Process Started",
          });
          if (!visaStatus) {
            visaStatus = await VisaStatus.create({
              name: "Visa Process Started",
            });
          }

          visitor.visaApplicationDetails.status = visaStatus.name;
        }
      }
    }

    if (updateData.visaAllocationId && updateData.visaAllocationUpdate) {
      const index = visitor.visaAllocationDetails.findIndex(
        (e) => e._id.toString() === updateData.visaAllocationId.toString()
      );

      if (index !== -1) {
        const existingData = visitor.visaAllocationDetails[index].toObject();

        visitor.visaAllocationDetails[index] = {
          ...existingData,
          ...updateData.visaAllocationUpdate,
          created_by: existingData.created_by,
          createdByName: existingData.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    // visa application handle

    if (updateData.visaApplicationDetails) {
      if (!visitor.visaApplicationDetails) {
        visitor.visaApplicationDetails = {
          ...updateData.visaApplicationDetails,
          created_by: userId,
          createdByName: userName,
        };
      } else {
        visitor.visaApplicationDetails = {
          ...visitor.visaApplicationDetails,
          ...updateData.visaApplicationDetails,
          created_by: visitor.visaApplicationDetails.created_by || userId,
          createdByName:
            visitor.visaApplicationDetails.createdByName || userName,
          updated_by: userId,
          updatedByName: userName,
        };
      }

      if (updateData.visaApplicationDetails?.feeStatus === "Paid") {
        let visaStatus = await VisaStatus.findOne({ name: "Visa Fee Paid" });
        if (!visaStatus) {
          visaStatus = await VisaStatus.create({ name: "Visa Fee Paid" });
        }
        visitor.visaApplicationDetails.status = visaStatus.name;
      }

      if (updateData.visaApplicationDetails?.biometricsUploaded) {
        let visaStatus = await VisaStatus.findOne({
          name: "Biometrics Completed",
        });
        if (!visaStatus) {
          visaStatus = await VisaStatus.create({
            name: "Biometrics Completed",
          });
        }

        visitor.visaApplicationDetails.status = visaStatus.name;
      }

      if (updateData.visaApplicationDetails?.RP_decisionDate) {
        visitor.visaApplicationDetails.RP_decisionDate.created_by = userId;
        visitor.visaApplicationDetails.RP_decisionDate.createdByName = userName;
      }

      if (updateData.visaApplicationDetails?.VFSAppointmentDateTime) {
        let visaStatus = await VisaStatus.findOne({ name: "VFS Date Booked" });
        if (!visaStatus) {
          visaStatus = await VisaStatus.create({ name: "VFS Date Booked" });
        }

        visitor.visaApplicationDetails.status = visaStatus.name;
      }
      if (updateData.visaApplicationDetails?.visaFileHandover) {
        visitor.visaApplicationDetails.visaFileHandover.created_by = userId;
        visitor.visaApplicationDetails.visaFileHandover.createdByName =
          userName;
      }

      if (updateData.visaApplicationDetails?.visaFileSubmission) {
        visitor.visaApplicationDetails.visaFileSubmission.updated_by = userId;
        visitor.visaApplicationDetails.visaFileSubmission.updatedByName =
          userName;

        if (
          updateData.visaApplicationDetails?.visaFileSubmission
            ?.finalChecklistConfirmed &&
          updateData.visaApplicationDetails?.visaFileSubmission?.fileSubmission
            ?.isSubmitted &&
          updateData.visaApplicationDetails?.visaFileSubmission
            ?.submissionDateRecorded
        ) {
          let visaStatus = await VisaStatus.findOne({ name: "Visa Filed" });
          if (!visaStatus) {
            visaStatus = await VisaStatus.create({ name: "Visa Filed" });
          }

          visitor.visaApplicationDetails.status = visaStatus.name;
        }
      }

      if (updateData.visaApplicationDetails?.visaOutcomeStatus) {
        let visaStatus = await VisaStatus.findOne({
          name: "Visa Decision Updated also upload visa decision proof",
        });
        if (!visaStatus) {
          visaStatus = await VisaStatus.create({
            name: "Visa Decision Updated also upload visa decision proof",
          });
        }

        visitor.visaApplicationDetails.visaOutcomeDate = new Date();
        visitor.visaApplicationDetails.status = visaStatus.name;
        const recipients = await getEmailRecipient(visitor);

        // for (const { recipientEmail, recipientType } of recipients) {
        //   await sendVisaStatusUpdateEmail(
        //     recipientEmail,
        //     visitor.visitorId,
        //     visitor.visaApplicationDetails.visaOutcomeStatus,
        //     visitor.updatedAt,
        //     visitor.name,
        //     recipientType
        //   );
        // }

        if (
          updateData.visaApplicationDetails.visaOutcomeStatus === "Approved"
        ) {
          // Step 1: Get role IDs for "Super Admin" and "Accountant"
          const roles = await Role.find({
            name: { $in: ["Super Admin", "Accountant"] },
          }).select("_id");
          const roleIds = roles.map((role) => role._id);

          // Step 2: Get users with those role IDs
          const notifyUsers = await User.find({
            role: { $in: roleIds },
            email: { $ne: null },
          }).select("email");

          // Step 3: Send mail to each
          // for (const user of notifyUsers) {
          //   await sendNewEligibleStudentEmail(
          //     user.email,
          //     visitor.visitorId,
          //     "Visa Approved",
          //     visitor.name
          //   );
          // }
        }
      }

      if (updateData.visaApplicationDetails?.remarks) {
        visitor.visaApplicationDetails.remarks.created_by = userId;
        visitor.visaApplicationDetails.remarks.createdByName = userName;
      }

      if (updateData.visaApplicationDetails?.status) {
        visitor.visaApplicationDetails.status =
          updateData.visaApplicationDetails?.status;
      }
    }

    visitor.updated_by = userId;
    visitor.updatedByName = userName;

    if (
      updateData.isSubmit === true &&
      (visitor.isSubmit === false || visitor.isSubmit === undefined)
    ) {
      const visitorName = `${visitor.name}`;
      const b2bPartnerName =
        visitor.b2bCompany || visitor.createdByName || "B2B Partner";
      const senderName = b2bPartnerName;
      const companyName = "Kurm Infotech";

      const usersToEmail = [];

      let targetRoleNames = [
        "Super Admin",
        "Head of op",
        "Branch Manager",
        "Head of B2B",
        "Head of Admission",
        "Team Leader - Admission (Finland)",
        "Team Leader - Admission (Europe)",
      ];

      // Remove Branch Manager if created_by_type is B2B
      if (["B2B Admin", "B2B Member"].includes(visitor.created_by_type)) {
        targetRoleNames = targetRoleNames.filter(
          (role) => role !== "Branch Manager"
        );
      }
      const targetRoles = await Role.find({
        name: { $in: targetRoleNames },
      });

      if (targetRoles?.length > 0) {
        const roleIds = targetRoles.map((role) => role._id);

        const roleBasedUsers = await User.find({
          role: { $in: roleIds },
        });

        usersToEmail.push(...roleBasedUsers);
      }

      // Get users from userAllocationDetails
      if (
        visitor.userAllocationDetails &&
        visitor.userAllocationDetails?.length > 0
      ) {
        const allocationUserIds = visitor.userAllocationDetails.map(
          (allocation) => allocation.user
        );

        const allocationUsers = await User.find({
          _id: { $in: allocationUserIds },
        });

        usersToEmail.push(...allocationUsers);
      }

      // Remove duplicates
      const uniqueUsers = usersToEmail.filter(
        (user, index, self) =>
          index ===
          self.findIndex((u) => u._id.toString() === user._id.toString())
      );

      // Send emails to all unique users
      // await Promise.all(
      //   uniqueUsers.map(async (user) => {
      //     try {
      //       await sendNewStudentApplicationEmail(
      //         user.email,
      //         user.name,
      //         studentName,
      //         b2bPartnerName,
      //         senderName,
      //         companyName,
      //         null
      //       );
      //     } catch (err) {
      //       console.error(`❌ Failed to send student app email to ${user.email}:`, err.message);
      //     }
      //   })
      // );

      const bccList = [...new Set(uniqueUsers.map((u) => u.email))];

      // Send email to all via BCC
      // await sendNewStudentApplicationEmail(
      //   bccList,
      //   visitorName,
      //   b2bPartnerName,
      //   senderName,
      //   companyName,
      //   null
      // );
    }

    if (updateData && typeof updateData.isSubmit !== "undefined") {
      // Only update if student's current isSubmit is false
      if (visitor.isSubmit !== true) {
        visitor.isSubmit = updateData.isSubmit;

        if (updateData.isSubmit === true) {
          let newStatus = await visitorStatus.findOne({ name: "New" });

          if (!newStatus) {
            newStatus = await visitorStatus.create({
              name: "New",
            });
          }

          visitor.mainStatus = newStatus._id;
        }
      }
    }
    await visitor.save();

    if (updateData.mainStatus) {
      await visitor.populate("mainStatus", "name");

      const recipients = await getEmailRecipient(visitor);
      for (const { recipientEmail, recipientType } of recipients) {
        await sendApplicationStatusUpdateEmail(
          recipientEmail,
          null,
          visitor.visitorId,
          visitor.mainStatus?.name,
          visitor.updatedAt,
          visitor.name,
          recipientType
        );
      }
    }

    return visitor;
  },

  getAll: async (
    page,
    limit,
    searchText = "",
    currentUser,
    mainStatus = "",
    branchId,
    showAll = false,
    country,
    followUp
  ) => {
    const populateFields = [
      {
        path: "userAllocationDetails",
        populate: [
          { path: "role", select: "name" },
          { path: "user", select: "name" },
          { path: "created_by", select: "name" },
        ],
      },
      // {
      //   path: "visaAllocationDetails",
      //   populate: [
      //     { path: "role", select: "name" },
      //     { path: "user", select: "name" },
      //     { path: "created_by", select: "name" },
      //   ],
      // },
      { path: "uploadedDocumentDetails.created_by", select: "name" },
      { path: "educationDetails.created_by", select: "name" },
      { path: "entranceExamDetails.created_by", select: "name" },
      { path: "aptitudeExamDetails.created_by", select: "name" },
      { path: "workExperience.created_by", select: "name" },
      { path: "created_by", select: "name" },
      { path: "personalDetailStatus", select: "name" },
      { path: "documentDetailStatus", select: "name" },
      // { path: "counsellingDetailStatus", select: "name" },
      { path: "lastUpdatedStatus", select: "name" },
      { path: "mainStatus", select: "name color" },
      { path: "branch", select: "name" },
    ];

    const searchOptions = {
      searchText,
      searchFields: ["name", "contact", "email", "visitorId"],
    };

    const filter = {};
    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === "Super Admin" || roleName === "Branch Manager") {
      if (String(showAll) === "true") {
        if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
          filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
        }
      } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        const branchUsers = await User.find({ branchId }).select("_id");
        const branchUserIds = branchUsers.map((u) => u._id.toString());
        filter.created_by = { $in: [branchId, ...branchUserIds] };
      } else {
        const accessConditions = [
          { isSubmit: true },
          { created_by: currentUser.userId },
          { clone_by: currentUser.userId },
        ];

        if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
          const mainStatusId = new mongoose.Types.ObjectId(mainStatus);
          filter.$or = accessConditions.map((cond) => ({
            $and: [cond, { mainStatus: mainStatusId }],
          }));
        } else {
          filter.$or = accessConditions;
        }
      }
    } else {
      if (roleName === "B2B Admin") {
        const b2bMembers = await B2BMember.find({
          b2bAdmin: currentUser.userId,
        }).select("_id");
        const memberIds = b2bMembers.map((m) => m._id.toString());
        filter.created_by = { $in: [currentUser.userId, ...memberIds] };

        if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
          filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
        }
      } else if (roleName === "B2B Member") {
        filter.created_by = currentUser.userId;

        if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
          filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
        }
      } else if (roleName === "Branch") {
        const branchMembers = await User.find({
          branchId: currentUser.userId,
        }).select("_id");
        const branchMemberIds = branchMembers.map((m) => m._id.toString());
        filter.created_by = { $in: [currentUser.userId, ...branchMemberIds] };
        if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
          filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
        }
      } else if (roleName === "Branch Member") {
        filter.created_by = currentUser.userId;

        if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
          filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
        }
      } else if (currentUser.viewB2BStudentApplication) {
        const allocationMatch = {
          userAllocationDetails: {
            $elemMatch: { user: currentUser.userId },
          },
        };
        filter.isSubmit = true;

        if (currentUser.whichB2BStudentApplication === "all") {
          const accessConditions = [
            { created_by: currentUser.userId },
            {
              created_by_type: {
                $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
              },
            },
            allocationMatch,
          ];

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            const mainStatusId = new mongoose.Types.ObjectId(mainStatus);
            filter.$or = accessConditions.map((cond) => ({
              $and: [cond, { mainStatus: mainStatusId }],
            }));
          } else {
            filter.$or = accessConditions;
          }
        } else if (currentUser.whichB2BStudentApplication === "countrywise") {
          const userDoc = await User.findById(currentUser.userId).select(
            "country"
          );

          const accessConditions = [];

          accessConditions.push({ created_by: currentUser.userId });

          if (userDoc?.country?.length) {
            accessConditions.push({
              $and: [
                {
                  created_by_type: {
                    $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
                  },
                },
                {
                  preferredCountry: {
                    $in: userDoc.country.map((c) => new RegExp(`^${c}$`, "i")),
                  },
                },
              ],
            });
          }

          accessConditions.push(allocationMatch);

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            const mainStatusId = new mongoose.Types.ObjectId(mainStatus);
            filter.$or = accessConditions.map((cond) => ({
              $and: [cond, { mainStatus: mainStatusId }],
            }));
          } else {
            filter.$or = accessConditions;
          }
        } else {
          const accessConditions = [
            { created_by: currentUser.userId },
            allocationMatch,
          ];

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            const mainStatusId = new mongoose.Types.ObjectId(mainStatus);
            filter.$or = accessConditions.map((cond) => ({
              $and: [cond, { mainStatus: mainStatusId }],
            }));
          } else {
            filter.$or = accessConditions;
          }
        }
      } else {
        const accessConditions = [
          { created_by: currentUser.userId },
          {
            userAllocationDetails: { $elemMatch: { user: currentUser.userId } },
          },
          {
            visaAllocationDetails: { $elemMatch: { user: currentUser.userId } },
          },
        ];

        if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
          const mainStatusId = new mongoose.Types.ObjectId(mainStatus);
          filter.$or = accessConditions.map((cond) => ({
            $and: [cond, { mainStatus: mainStatusId }],
          }));
        } else {
          filter.$or = accessConditions;
        }
      }
    }

    const fullUser = await User.findById(currentUser.userId).select(
      "viewSpecificB2B b2bCountry b2bState"
    );

    if (fullUser?.viewSpecificB2B) {
      const userStates = Array.isArray(fullUser.b2bState)
        ? fullUser.b2bState.map((s) => s.toLowerCase())
        : [];
      const userCountries = Array.isArray(fullUser.b2bCountry)
        ? fullUser.b2bCountry.map((c) => c.toLowerCase())
        : [];
      const useStateFilter = userStates?.length > 0;

      const b2bAdmins = await B2BAdmin.find().select(
        "companyName state country"
      );
      const allowedCompanyNames = [];

      for (const b2b of b2bAdmins) {
        const stateMatch =
          useStateFilter &&
          b2b.state &&
          userStates.includes(b2b.state.toLowerCase());
        const countryMatch =
          !useStateFilter &&
          b2b.country &&
          userCountries.includes(b2b.country.toLowerCase());

        if (stateMatch || countryMatch) {
          allowedCompanyNames.push(b2b.companyName);
        }
      }

      if (allowedCompanyNames?.length) {
        const b2bAccessConditions = [
          {
            created_by_type: "B2B Admin",
            createdByName: { $in: allowedCompanyNames },
          },
          {
            created_by_type: "B2B Member",
            b2bCompany: { $in: allowedCompanyNames },
          },
        ];

        // Combine with existing $or if present
        if (!filter.$or) filter.$or = [];
        filter.$or.push(...b2bAccessConditions);
      }
    }

    if (country) {
      filter["preferredCountry"] = new RegExp(`^${country}$`, "i");
    }

    if (followUp) {
      const followUpDate = new Date(followUp);
      const nextDay = new Date(followUpDate);
      nextDay.setDate(followUpDate.getDate() + 1);

      const validFollowUpTabs = [
        "followUps.personalDetails.nextFollowUpDate",
        "followUps.documentDetails.nextFollowUpDate",
        "followUps.visaApplication.nextFollowUpDate",
      ];

      const followUpConditions = validFollowUpTabs.map((field) => ({
        [field]: { $gte: followUpDate, $lt: nextDay },
      }));

      const newAndArray = [];

      // Keep any direct filters (country, mainStatus, etc.)
      for (const [key, value] of Object.entries(filter)) {
        if (key !== "$or" && key !== "$and") {
          newAndArray.push({ [key]: value });
          delete filter[key];
        }
      }

      // Keep existing OR conditions (access rules)
      if (filter.$or) {
        newAndArray.push({ $or: filter.$or });
        delete filter.$or;
      }

      // Keep existing AND conditions
      if (filter.$and) {
        newAndArray.push(...filter.$and);
        delete filter.$and;
      }

      // Add the follow-up condition
      newAndArray.push({ $or: followUpConditions });

      // Set the final AND filter
      filter.$and = newAndArray;
    }
    const getAll = await paginate(
      visitorApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getAll || !getAll.data || !getAll.data.length) {
      throw { status: false, message: "No visitors found" };
    }
    for (const visitor of getAll.data) {
      if (visitor.created_by_type === "B2B Admin" && visitor.createdByName) {
        const b2bData = await B2BAdmin.findOne({
          companyName: visitor.createdByName,
        }).select("phone");
        visitor.b2bContact = b2bData?.phone || null;
      } else if (
        visitor.created_by_type === "B2B Member" &&
        visitor.b2bCompany
      ) {
        const b2bData = await B2BAdmin.findOne({
          companyName: visitor.b2bCompany,
        }).select("phone");
        visitor.b2bContact = b2bData?.phone || null;
      }
    }

    const visitorIds = getAll.data.map((visitor) => visitor._id);
    const invoices = await GenerateInvoice.find({
      name: { $in: visitorIds },
    }).select("name dueAmount");

    const invoiceMap = {};
    for (const inv of invoices) {
      const visitorId = inv.name?.toString();
      if (visitorId) {
        invoiceMap[visitorId] = inv.dueAmount || "0";
      }
    }

    for (const visitor of getAll.data) {
      const visitorId = visitor._id.toString();
      visitor.dueAmount = invoiceMap[visitorId] || "0";
    }

    return getAll;
  },

  getOne: async (visitorId) => {
    const populateFields = [
      {
        path: "userAllocationDetails",
        populate: [
          { path: "role", select: "name" },
          { path: "user", select: "name" },
          { path: "created_by", select: "name" },
        ],
      },
      {
        path: "visaAllocationDetails",
        populate: [
          { path: "role", select: "name" },
          { path: "user", select: "name" },
          { path: "created_by", select: "name" },
        ],
      },
      { path: "uploadedDocumentDetails.created_by", select: "name" },
      { path: "educationDetails.created_by", select: "name" },
      { path: "entranceExamDetails.created_by", select: "name" },
      { path: "aptitudeExamDetails.created_by", select: "name" },
      { path: "workExperience.created_by", select: "name" },
      { path: "created_by", select: "name" },
      { path: "personalDetailStatus", select: "name" },
      { path: "documentDetailStatus", select: "name" },
      // { path: "counsellingDetailStatus", select: "name" },
      { path: "lastUpdatedStatus", select: "name" },
      { path: "mainStatus", select: "name color" },
      { path: "branch", select: "name" },
    ];

    const visitor = await visitorApplication
      .findById(visitorId)
      .populate(populateFields);

    if (!visitor) {
      throw { status: false, message: "Visitor not found" };
    }

    return visitor;
  },

  delete: async (studentId, params = {}) => {
    const student = await visitorApplication.findById(studentId);
    if (!student) {
      throw { status: false, message: "Visitor application not found" };
    }

    const hasSubDocId =
      params.educationDetailId ||
      params.entranceExamId ||
      params.aptitudeExamId ||
      params.workExperienceId ||
      params.documentId ||
      params.userAllocationId ||
      params.visaAllocationId ||
      params.categoryId;

    if (!hasSubDocId) {
      // if (
      //   student.uploadedDocumentDetails &&
      //   student.uploadedDocumentDetails.length > 0
      // ) {
      //   const fs = require("fs");

      //   for (const doc of student.uploadedDocumentDetails) {
      //     try {
      //       if (doc.filePath && fs.existsSync(doc.filePath)) {
      //         fs.unlinkSync(doc.filePath);
      //       }
      //     } catch (fileError) {
      //       console.error(`Error deleting file: ${doc.filePath}`, fileError);
      //     }
      //   }
      // }

      const deletedVisitor = await visitorApplication.findByIdAndDelete(
        studentId
      );

      if (!deletedVisitor) {
        throw { status: false, message: "Failed to delete visitor" };
      }

      return "Visitor deleted successfully";
    }

    let updateQuery = {};
    let message = "Record deleted successfully";

    if (params.educationDetailId) {
      updateQuery = {
        $pull: { educationDetails: { _id: params.educationDetailId } },
      };
      message = "Education detail deleted successfully";
    } else if (params.entranceExamId) {
      updateQuery = {
        $pull: { entranceExamDetails: { _id: params.entranceExamId } },
      };
      message = "Entrance exam detail deleted successfully";
    } else if (params.aptitudeExamId) {
      updateQuery = {
        $pull: { aptitudeExamDetails: { _id: params.aptitudeExamId } },
      };
      message = "Aptitude exam detail deleted successfully";
    } else if (params.workExperienceId) {
      updateQuery = {
        $pull: { workExperience: { _id: params.workExperienceId } },
      };
      message = "Work experience deleted successfully";
    } else if (params.userAllocationId) {
      updateQuery = {
        $pull: { userAllocationDetails: { _id: params.userAllocationId } },
      };
      message = "Assigned user deleted successfully";
    } else if (params.documentId) {
      // const documentToDelete = student.uploadedDocumentDetails.find(
      //   (doc) => doc._id.toString() === params.documentId
      // );

      // if (documentToDelete && documentToDelete.filePath) {
      //   try {
      //     const fs = require("fs");

      //     if (fs.existsSync(documentToDelete.filePath)) {
      //       fs.unlinkSync(documentToDelete.filePath);
      //     }
      //   } catch (fileError) {
      //     console.error(
      //       `Error deleting file: ${documentToDelete.filePath}`,
      //       fileError
      //     );
      //   }
      // }

      updateQuery = {
        $pull: { uploadedDocumentDetails: { _id: params.documentId } },
      };
      message = "Document deleted successfully";
    } else if (params.visaAllocationId) {
      updateQuery = {
        $pull: { visaAllocationDetails: { _id: params.visaAllocationId } },
      };
      message = "Visa allocated user deleted successfully";
    } else if (params.categoryId) {
      updateQuery = {
        $pull: { categoryDetails: { _id: params.categoryId } },
      };
      message = "Category detail deleted successfully";
    }

    const updateResult = await visitorApplication.updateOne(
      { _id: studentId },
      updateQuery
    );

    if (updateResult.modifiedCount === 0) {
      throw { status: false, message: "Record not found or already deleted" };
    }

    return message;
  },

  downloadDocuments: async (visitorId, documentIds) => {
    const application = await visitorApplication.findById(visitorId);
    if (!application) {
      throw { status: false, message: "Visitor application not found" };
    }

    const docIdArray = documentIds.includes(",")
      ? documentIds.split(",").map((id) => id.trim())
      : [documentIds];

    const documents = [];

    for (const docId of docIdArray) {
      const document = application.uploadedDocumentDetails.find(
        (doc) => doc._id.toString() === docId
      );

      if (document && document.filePath) {
        let ext = null;

        // Try to get extension from filePath
        const urlParts = document.filePath.split(".");
        if (urlParts.length > 1) {
          ext = urlParts[urlParts.length - 1].split("?")[0];
        }

        // If extension not found, default to pdf
        if (!ext || ext.length > 5 || ext.includes("/")) {
          ext = "pdf";
        }

        const fileName = document.originalName
          ? document.originalName.includes(".")
            ? document.originalName
            : `${document.originalName}.${ext}`
          : `document-${docId}.${ext}`;

        documents.push({
          filePath: document.filePath,
          fileName,
        });
      }
    }

    if (documents.length === 0) {
      throw { status: false, message: "No valid documents found" };
    }

    return documents;
  },
  cloneVisitorApplication: async (
    visitorApplicationId,
    newCountryName,
    userId
  ) => {
    if (!visitorApplicationId) {
      throw {
        status: false,
        message: "Visitor application Id is required",
      };
    }

    const originalApplication = await visitorApplication.findById(
      visitorApplicationId
    );

    if (!originalApplication) {
      throw { status: false, message: "Original application not found" };
    }

    const newApplicationData = originalApplication.toObject();
    delete newApplicationData._id;
    delete newApplicationData.userAllocationDetails;
    delete newApplicationData.isSubmit;

    // newApplicationData.interestedCourseDetails[0].institute = newInstituteId;
    newApplicationData.preferredCountry = newCountryName;

    newApplicationData.visitorId = await getVisitorNextSequence(
      "visitorId",
      "VT"
    );

    newApplicationData.createdAt = new Date();

    newApplicationData.clone_by = userId;
    let newMainStatus = await visitorStatus.findOne({ name: "New" });

    if (!newMainStatus) {
      newMainStatus = await visitorStatus.create({
        name: "New",
      });
    }
    newApplicationData.mainStatus = newMainStatus._id;
    const newApplication = new visitorApplication(newApplicationData);
    await newApplication.save();

    return newApplication;
  },
  checkPendingDoc: async (visitorId) => {
    if (!visitorId || !mongoose.Types.ObjectId.isValid(visitorId)) {
      throw { status: false, message: "Invalid or missing visitorId" };
    }

    const visitor = await visitorApplication.findById(visitorId);
    if (!visitor) {
      throw { status: false, message: "Visitor not found" };
    }

    const country = visitor.preferredCountry;
    if (!country) {
      throw {
        status: false,
        message: "Preferred country not found in visitor details",
      };
    }

    const docList = await touristDocument.findOne({ country }).lean();
    if (!docList) {
      throw { status: false, message: "No document list for this country" };
    }

    const uploadedDocSet = new Set(
      (visitor.uploadedDocumentDetails || []).map(
        (doc) =>
          `${doc.documentType?.toString() || ""}_${
            doc.documentName?.toString() || ""
          }`
      )
    );

    const missingDocEntries = [];

    for (const docGroup of docList.documents || []) {
      const typeId = docGroup.type?.toString();

      for (const docItem of docGroup.documentList || []) {
        const documentId = docItem.document?.toString();
        const key = `${typeId}_${documentId}`;

        if (!uploadedDocSet.has(key)) {
          missingDocEntries.push({
            documentId,
            typeId,
            required: true,
          });
        }
      }
    }

    const documentIds = missingDocEntries.map((doc) => doc.documentId);
    const documents = await Document.find({ _id: { $in: documentIds } })
      .populate({ path: "type", model: "visitorDocumentType", select: "name" })
      .select("name type")
      .lean();

    const docDetailMap = {};
    for (const doc of documents) {
      docDetailMap[doc._id.toString()] = {
        documentName: doc.name,
        documentTypeName: doc.type?.name || "Unknown",
      };
    }

    const missingDocuments = missingDocEntries.map((doc) => ({
      ...doc,
      documentName: docDetailMap[doc.documentId]?.documentName || "Unknown",
      documentTypeName:
        docDetailMap[doc.documentId]?.documentTypeName || "Unknown",
    }));

    // ➕ Add: Type-wise count
    const typeWiseCounts = {};
    for (const doc of missingDocuments) {
      const type = doc.documentTypeName;
      if (!typeWiseCounts[type]) {
        typeWiseCounts[type] = 0;
      }
      typeWiseCounts[type]++;
    }

    return {
      missingDocuments, // full details
      typeWiseCounts, // { Passport: 2, SOP: 1, etc. }
    };
  },
  sendPendingDocumentsEmail: async (visitorId, customDocumentList = null) => {
    console.log("customDocumentListcustomDocumentList", customDocumentList);
    const visitor = await visitorApplication.findById(visitorId);
    if (!visitor) {
      throw { status: false, message: "Visitor not found" };
    }

    let documentsToSend = [];

    if (
      customDocumentList &&
      Array.isArray(customDocumentList) &&
      customDocumentList.lenth > 0
    ) {
      documentsToSend = customDocumentList;
    } else {
      const missingDocs = await visitorApplicationServices.checkPendingDoc(
        visitor._id
      );
      documentsToSend = missingDocs.missingDocuments || [];
    }

    // Determine recipient email
    let recipientEmail = visitor.email;
    let recipientType = "Visitor";

    if (visitor.created_by_type === "B2B Admin") {
      const b2bAdmin = await B2BAdmin.findById(visitor.created_by).select(
        "email"
      );
      if (b2bAdmin?.email) {
        recipientEmail = b2bAdmin.email;
        recipientType = "B2B";
      }
    } else if (visitor.created_by_type === "B2B Member") {
      const b2bMember = await B2BMember.findById(student.created_by).select(
        "email"
      );
      if (b2bMember?.email) {
        recipientEmail = b2bMember.email;
        recipientType = "B2B";
      }
    }

    await sendPendingDocsVisitorEmail(
      recipientEmail,
      documentsToSend,
      visitor.name,
      visitor.visitorId,
      recipientType
    );

    return customDocumentList
      ? "Custom documents email sent successfully"
      : "Pending documents email sent successfully";
  },
};

module.exports = visitorApplicationServices;
