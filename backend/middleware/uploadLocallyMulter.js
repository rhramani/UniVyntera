// uploadDisk.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// Create the multer instance for disk storage
const uploadDisk = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "profile", maxCount: 1 },
  { name: "brochure", maxCount: 1 },
  { name: "excelFile", maxCount: 1 },
  { name: "material", maxCount: 1 },
  { name: "messageImage", maxCount: 1 },
  { name: "messageFile", maxCount: 1 },
  { name: "gmailTopLogo", maxCount: 1 },
  { name: "gmailBottomLogo", maxCount: 1 },
  { name: "invoiceLogo", maxCount: 1 },
  { name: "agreementDoc", maxCount: 1 },
  { name: "expenseProof", maxCount: 1 },
  { name: "coachingDoc", maxCount: 5 },
  { name: "fundTransfer", maxCount: 1 },
  { name: "uploadedDocument", maxCount: 5 },
  { name: "mockTestDoc", maxCount: 1 },
  { name: "categoryDoc", maxCount: 5 },
  { name: "loginPageLogo", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "resultDoc", maxCount: 1 },
  { name: "cancelCheque", maxCount: 1 },
  { name: "taskDoc" , maxCount: 1 },
  { name: "agreementByStudent" , maxCount: 1 },
  { name: "agreementByAgency" , maxCount: 1 },
  { name:"profileImage" , maxCount:1}
]);

module.exports = uploadDisk;
