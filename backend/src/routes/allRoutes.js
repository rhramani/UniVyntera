const router = require("express").Router();

const userRoutes = require("./user");
const subModules = require("./submodules");
const leadRoutes = require("./leadRoutes");
const aiCallLeadRoutes = require("./aiCallLead");
const leadStatusRoutes = require("./leadStatus");
const leadSubStatusRoutes = require("./leadSubStatus");
const settingRoutes = require("./settings");
const crmSettingsRoutes = require("./crmSettings");
const rolesPermissionRoutes = require("./rolesPermission");
const clientMailRoutes = require("./clientMail");
const clientMailCategoryRoutes = require("./clientMailCategory");
const b2bLeadStatusRoutes = require("./masters/lead/b2bLeadStatus");

router.use("/users", userRoutes);
router.use("/submodules", subModules);
router.use("/leads", leadRoutes);
router.use("/aiCallLead" , aiCallLeadRoutes);
router.use("/leadStatus", leadStatusRoutes);
router.use("/leadSubStatus" , leadSubStatusRoutes);
router.use("/setting", settingRoutes);
router.use("/crmSettings" , crmSettingsRoutes);
router.use("/role-permission", rolesPermissionRoutes);
router.use("/clientMail", clientMailRoutes);
router.use("/clientMailCategory", clientMailCategoryRoutes);
router.use("/b2bLeadStatus" , b2bLeadStatusRoutes);

// b2b master routes
const b2bAdminRoutes = require("./masters/b2b/b2bAdmin");
const b2bMemberRoutes = require("./masters/b2b/b2bMember");

router.use("/b2bAdmin", b2bAdminRoutes);
router.use("/b2bMember", b2bMemberRoutes);

// master routes
const qualificationMasterRoutes = require("./masters/qualificationMaster");
const streamMasterRoutes = require("./masters/streamMaster");
const instituteMasterRoutes = require("./masters/instituteMaster");
const directInstituteMasterRoutes = require("./masters/directInstitute");
const campusMasterRoutes = require("./masters/campusMaster");
const programLevelMasterRoutes = require("./masters/programLevelMaster");
const requirementsMasterRoutes = require("./masters/requirementsMaster");
const courseMasterRoutes = require("./masters/courseMaster");
const rolesMasterRoutes = require("./masters/roles-Master");
const courseTagMasterRoutes = require("./masters/courseTagMaster");
const wpcategoryMasterRoutes = require("./masters/wpcategory");
const wptemplateMasterRoutes = require("./masters/wptemplate");
const notificationMasterRoutes = require("./masters/notification/notification")

router.use("/qualification", qualificationMasterRoutes);
router.use("/stream", streamMasterRoutes);  
router.use("/institute", instituteMasterRoutes);
router.use("/directInstitute" , directInstituteMasterRoutes);
router.use("/campus", campusMasterRoutes);
router.use("/programLevel", programLevelMasterRoutes);
router.use("/requirements", requirementsMasterRoutes);
router.use("/course", courseMasterRoutes);
router.use("/roles", rolesMasterRoutes);
router.use("/tag", courseTagMasterRoutes);
router.use("/wpCategory", wpcategoryMasterRoutes);
router.use("/wpTemplate", wptemplateMasterRoutes);
router.use("/notification", notificationMasterRoutes);


// lead master routes

const examMasterRoutes = require("./masters/lead/exam");
const degreeMasterRoutes = require("./masters/lead/degree");
const inquiryMasterRoutes = require("./masters/lead/inquiry");
const leadFollowUpTypeRoutes = require("./masters/lead/followUpType");

router.use("/leads/exam", examMasterRoutes);
router.use("/leads/degree", degreeMasterRoutes);
router.use("/leads/inquiry", inquiryMasterRoutes);
router.use("/leads/followUpType", leadFollowUpTypeRoutes);

//coaching details master routes

const coachingRequirementRoutes = require("./masters/coachingDetails/coachingRequirement");
const studentRegisterForRoutes = require("./masters/coachingDetails/studentRegisterFor");
const coachingFacultyRoutes = require("./masters/coachingDetails/coachingFaculty");
const attendenceRoutes = require("./masters/coachingDetails/attendance");
const coachingStatusRoutes = require("./masters/coachingDetails/studentStatus");
const subjectRoutes = require("./masters/coachingDetails/subject");
const levelRoutes = require("./masters/coachingDetails/level");

router.use("/coachingRequirement", coachingRequirementRoutes);
router.use("/studentRegisterFor", studentRegisterForRoutes);
router.use("/coachingFaculty", coachingFacultyRoutes);
router.use("/attendence", attendenceRoutes);
router.use("/coachingStatus", coachingStatusRoutes);
router.use("/subject", subjectRoutes);
router.use("/level", levelRoutes);

// document list master routes

const documentTypeMasterRoutes = require("./masters/documentList/documentType");
const documentMasterRoutes = require("./masters/documentList/document");
const countryDocumentMasterRoutes = require("./masters/documentList/countryDocument");
const touristDocumentMasterRoutes = require("./masters/documentList/touristDocument");
const workPermitDocumentMasterRoutes = require("./masters/documentList/workPermitDocument");

router.use("/documentType", documentTypeMasterRoutes);
router.use("/documents", documentMasterRoutes);
router.use("/countryDocuments", countryDocumentMasterRoutes);
router.use("/touristDocuments", touristDocumentMasterRoutes);
router.use("/workDocuments", workPermitDocumentMasterRoutes);

const visitorDocumentTypeRoutes = require("./masters/documentList/visitor/visitorDocumentType");
router.use("/visitorDocumentType", visitorDocumentTypeRoutes);

const visitorDocumentRoutes = require("./masters/documentList/visitor/visitorDocument");
router.use("/visitorDocument", visitorDocumentRoutes);

const visitorStatusRoutes = require("./visitorApplication/visitorstatus");
router.use("/visitorStatus", visitorStatusRoutes);

const visitorApplicationStatusRoutes = require("./visitorApplication/visitorApplicationStatus");
router.use("/visitorApplicationStatus" , visitorApplicationStatusRoutes);

const visitorApplication = require("./visitorApplication/visitorApplication");
router.use("/visitorApplication", visitorApplication);
// visitor list master routes
const visitorTypeMasterRoutes = require("./masters/visitorList/visitorType");

router.use("/visitorType", visitorTypeMasterRoutes);


// Banking
const bankingMasterRoutes = require("./masters/banking");

router.use("/banking", bankingMasterRoutes);


// student master routes
const studentApplicationRoutes = require("./masters/studentApplication/studentApplication");
router.use("/studentApplication", studentApplicationRoutes);

const applicationType = require("./masters/studentApplication/applicationType");
router.use("/studentApplication/applicationType" , applicationType);

// student progress steps routes
const studentProgressbarRoutes = require("./masters/studentApplication/studentProgressbar");
router.use("/studentProgress", studentProgressbarRoutes);

const applicationStatusRoutes = require("./masters/studentApplication/applicationStatus");
router.use("/applicationStatus", applicationStatusRoutes);

const studentStatusRoutes = require("./masters/studentApplication/studentStatus");
router.use("/studentStatus", studentStatusRoutes);

const loanProviderRoutes = require("./masters/studentApplication/loanProvider");
router.use("/loanProvider" , loanProviderRoutes);

const interestedCourseStatusRoutes = require("./masters/studentApplication/interestedCourseStatus");
router.use("/interestedCourseStatus", interestedCourseStatusRoutes);

// branch
const branchRoutes = require("./branch/branches");
router.use("/branch", branchRoutes);

const branchMemberRoutes = require("./branch/branchMember");
router.use("/branchMember", branchMemberRoutes);

const promotionalMaterials = require("./PromotionalMaterials");
router.use("/promotionalDoc", promotionalMaterials);

const tutorialRoutes = require("./tutorial");
router.use("/tutorial", tutorialRoutes);

const promotionalTutorialRoutes = require("./promotionalTutorial");
router.use("/promotionalTutorial", promotionalTutorialRoutes);

const promotionalPptRoutes = require("./promotionalPpt");
router.use("/promotionalPpt", promotionalPptRoutes);

const socialMediaMaterialRoutes = require("./socialMediaMaterial");
router.use("/socialMediaMaterial", socialMediaMaterialRoutes);

const loginHistory = require("./loginHistory");
router.use("/loginHistory", loginHistory);

const announcementRoutes = require("./announcement");
router.use("/announcement", announcementRoutes);

const visaStatusMasterRoutes = require("./masters/visaStatus");
router.use("/visaStatus", visaStatusMasterRoutes);

const loanInquiryRoutes = require("./loanInquiry");
router.use("/loanInquiry", loanInquiryRoutes);

const loanStatus = require("./masters/loanStatus");
router.use("/loanStatus" , loanStatus);

const chatMessageRoutes = require("./chatMessage");
router.use("/chat", chatMessageRoutes);

const accountantRoutes = require("./accountant");
router.use("/accountant", accountantRoutes);

const otherRoutes = require("./masters/otherService")
router.use("/other",otherRoutes);

const accountantStatusRoutes = require("./masters/accountantStatus");
router.use("/accountantStatus", accountantStatusRoutes);

const currencyRateRoutes = require("./masters/currencyRate");
router.use("/currencyRate", currencyRateRoutes);

const studentInvoicesRoutes = require("./studentInvoice");
router.use("/studentInvoice", studentInvoicesRoutes);

const accountExpenseRoutes = require("./accountExpense");
router.use("/accountExpense", accountExpenseRoutes);

const expenseTypeRoutes = require("./masters/expenseType");
router.use("/expenseType", expenseTypeRoutes);

const mainPlanTypeRoutes = require("./masters/generateInvoice/mainPlan");
router.use("/mainPlan", mainPlanTypeRoutes);

const subPlanTypeRoutes = require("./masters/generateInvoice/subPlan");
router.use("/subPlan", subPlanTypeRoutes);

const generateInvoiceRoutes = require("./generateInvoice");
router.use("/generateInvoice", generateInvoiceRoutes);

const leadReportRoutes = require("./reports/leadReports");
router.use("/leadReports", leadReportRoutes);

const studentReportRoutes = require("./reports/studentApplicationReports");
router.use("/studentReports", studentReportRoutes);

const partenerCommissionReportsRoutes = require("./reports/partnerCommissionReports");
router.use("/partnerCommissionReports", partenerCommissionReportsRoutes);

const universityCommissionReportRoutes = require("./reports/universityCommissionReports");
router.use("/universityCommissionReports", universityCommissionReportRoutes);

const feePaymentReportsRoutes = require("./reports/financeReports");
router.use("/feePaymentReports", feePaymentReportsRoutes);

const visaReportsRoutes = require("./reports/visaReports");
router.use("/visaReports", visaReportsRoutes);

const dashboardRoutes = require("./dashboard");
router.use("/dashboard", dashboardRoutes);

const configurationRoutes = require("./configuration");
router.use("/config" , configurationRoutes);

// all reports

const allReports = require("./reports/allReports");
router.use("/allReport", allReports);

// waDaddy

const contactRoutes = require("./waDaddy/contact");
router.use("/waDaddy/contact", contactRoutes);

const groupRoutes = require("./waDaddy/group");
router.use("/waDaddy/group", groupRoutes);

const credentialRoutes = require("./waDaddy/credentials");
router.use("/waDaddy/credential", credentialRoutes);

const templateRoutes = require("./waDaddy/template");
router.use("/waDaddy/template", templateRoutes);

const campaignRoutes = require("./waDaddy/campaign");
router.use("/waDaddy/campaign", campaignRoutes);

const mediaRoutes = require("./waDaddy/media");
router.use("/waDaddy/media", mediaRoutes);

const messageRoutes = require("./waDaddy/message");
router.use("/waDaddy/message", messageRoutes);

const fundTransferRoutes = require("./fundTransfer");
router.use("/fundTransfer" , fundTransferRoutes);


// task management

const taskCategoryRoutes = require("./taskManagement/taskCategory");
router.use("/task/category" , taskCategoryRoutes);

const taskTypeRoutes = require("./taskManagement/taskType");
router.use("/task/type" , taskTypeRoutes);

const taskPriorityRoutes = require("./taskManagement/taskPriority");
router.use("/task/priority" ,taskPriorityRoutes );

const taskStatusRoutes = require("./taskManagement/taskStatus");
router.use("/task/status" , taskStatusRoutes);

const taskRoutes = require("./taskManagement/task");
router.use("/task" , taskRoutes);


// Voice AI 
const voiceAIRoutes = require('./voiceAI');
router.use('/voiceAI', voiceAIRoutes);

// Voice AI Webhook (external callback)

// Chatbox Api
router.use("/chatbox/template" , require("./chatbox/template"));
router.use("/chatbox/contact", require("./chatbox/contact"));
router.use("/chatbox/campaign", require("./chatbox/campaign"));
router.use("/chatbox/credential", require("./chatbox/credentials"));
router.use("/chatbox/message", require("./chatbox/message"));
router.use("/chatbox/media", require("./chatbox/media"));
router.use("/chatbox/group", require("./chatbox/group"));

// CTC calling
const ctcCallingRoutes = require("./ctcCalling");
router.use("/ctcCalling" , ctcCallingRoutes);


// internal chat

const internalChatUserList = require("./internalChatMessage");
router.use("/internalChat",internalChatUserList);

module.exports = router;
