// const multer = require("multer");
// const path = require("path");


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "logo" || file.fieldname === "loginPageLogo") {
//       cb(null, "public/");
//     } else {
//       cb(null, "uploads/");
//     }
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (file.fieldname === "logo" || file.fieldname === "loginPageLogo") {
//       cb(null, file.fieldname + ext);
//     } else {
//       cb(null, file.fieldname + "-" + Date.now() + ext);
//     }
//   }  
// }); 


// const fileFilter = (req,file,cb) => {
//   const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   const allowedPdfType = "application/pdf";
//   const allowedExcelTypes = [
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "application/vnd.ms-excel"
//   ];

//   if (allowedImageTypes.includes(file.mimetype) || file.mimetype === allowedPdfType || allowedExcelTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image and PDF/EXCEL files are allowed!"), false);
//   }
// }

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 2 * 1024 * 1024} // 2MB file size 
// })

// const uploadFields = upload.fields([
//     { name: "logo", maxCount: 1 },
//     { name: "profile", maxCount: 1 },
//     { name: "brochure", maxCount: 1},
//     { name: "excelFile", maxCount: 1},
//     { name: "cancelCheque" , maxCount: 1} ,
//     { name: "uploadedDocument", maxCount: 2},
//     { name: "loginPageLogo" , maxCount:1}
// ]);

// module.exports = uploadFields;


const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory buffer

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const allowedPdfType = "application/pdf";
  const allowedExcelTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const allowedPptTypes = [
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  ];

  if (
    allowedImageTypes.includes(file.mimetype) ||
    file.mimetype === allowedPdfType ||
    allowedExcelTypes.includes(file.mimetype) ||
    allowedPptTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image, PDF, Excel, or PPT files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

const uploadFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "cancelCheque", maxCount: 1 },
  { name: "uploadedDocument", maxCount: 5 },
  { name: "loginPageLogo", maxCount: 1 },
  { name: "material" , maxCount: 5},
  { name: "expenseProof" , maxCount: 1 },
  { name: "coachingDoc" , maxCount: 5 },
  { name: "resultDoc" , maxCount: 1 },
  { name: "mockTestDoc", maxCount: 1 },
  { name: "categoryDoc" , maxCount: 5 },
  { name: "fundTransfer" , maxCount: 1 },
]);

module.exports = uploadFields;



