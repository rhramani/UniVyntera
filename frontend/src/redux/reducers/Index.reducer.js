import { combineReducers } from "redux";
import themeReducer from "../../common/redux/Reducer";
import { adminReducer } from "./Admin.reducer";
import { createCourseFinderReducer } from "./CourseFinder.reducer";
import { cityReducer } from "./Master/City.reducer";
import { stateReducer } from "./Master/State.reducer";
import { countryReducer } from "./Master/Country.reducer";
import { qualificationReducer } from "./Master/Qualification.reducer";
import { streamReducer } from "./Master/Stream.reducer";
import { instituteReducer } from "./Master/Institute.reducer";
import { intakeReducer } from "./Master/Intake.reducer";
import { courseReducer } from "./Master/Course.reducer";
import { campusReducer } from "./Master/Campus.reducer";
import { programLevelReducer } from "./Master/ProgramLevel.reducer";
import { requirementReducer } from "./Master/Requirement.reducer";
import { B2BAdminReducer } from "./B2BAdmin.reducer";
import { LeadsReducer } from "./Lead.reducer"
import { B2BMemberReducer } from "./B2BMember.reducer";
import { leadStatusReducer } from "./Master/LeadStatus.reducer";
import { examReducer } from "./Lead/Exam.reducer";
import { degreeReducer } from "./Lead/Degree.reducer";
import { documentTypeReducer } from "./Document/DocumentType.reducer";
import { documentListReducer } from "./Document/DocumentList.reducer";
import { countryDocumentReducer } from "./Document/AssignDocument.reducer";
import { inquiryReducer } from "./Lead/Inquiry.reducer";
import { studentApplicationReducer } from "./Student/StudentApplication.reducer";
import { settingReducer } from "./Setting.reducer";
import { rolePermissionReducer } from "./RolePermission.reducer";
import { TagReducer } from "./Master/Tag.reducer";
import { progressbarReducer } from "./Master/Progressbar.reducer";
import { branchReducer } from "./Branch.reducer";
import { WhatsappTemplateReducer } from "./Whatsapp/WhatsapTemplate.reducer";
import { WhatsappCategoryReducer } from "./Whatsapp/WhatsappCategory.reducer";
import { applicationStatusReducer } from "./Student/ApplicationStatus.reducer";
import { studentStatusReducer } from "./Student/StudentStatus.reducer";
import { PromotionalDocumentReducer } from "./PromotionalDocument.reducer";
import { PromotionalTutorialReducer } from "./PromotionalTutorial.reducer";
import { TutorialReducer } from "./Tutorial.reducer";
import { WorkPermitDocumentReducer } from "./Document/WorkPermitDocument.reducer";
import { socialMediaPromotionReducer } from "./SocialMediaPromotion.reducer";
import { promotionalPptReducer } from "./PromotionalPpt.reducer";
import { totalAdmissionReducer } from "./Accountant/TotalAdmission.reducers";
import { universityCommissionReducer } from "./Accountant/UniversityCom.reducer";
import { visaStatusReducer } from "./Master/VisaStatus.reducer";
import { accountantStatusReducer } from "./Master/AccountantStatus.reducer";
import { expenseTypeReducer } from "./Master/ExpenseType.reducer";
import { expenseReducer } from "./Report/Expenses.reducer";
import { generateInvoiceReducer } from "./Accountant/GenerateInvoice.reducer";
import { leadReportsReducer } from "./Report/LeadReports.reducer";
import { studentApplicationReportReducer } from "./Report/StudentApplicationReport.reducer";
import coachingFaculty from "../../../../backend/model/masters/coachingDetails/coachingFaculty";
import { coachingFacultyReducer } from "./Master/CoachingFaculty.reducer";
import contactReducer from "./BulkMessage/Contact.reducer";
import groupReducers from "./BulkMessage/Group.reducer";
import templateReducer from "./BulkMessage/Template.reducer";
import campaignReducer from "./BulkMessage/Campaign.reducer";
import { credentialReducer } from "./BulkMessage/Credential.reducer";
import { VisitorDocumentReducer } from "./Document/VisitorDocuments.reducer";
import { visitorApplicationReducer } from "./Visitor/VisitorApplication.reducer";
import { visitorDocumentListReducer } from "./Document/VisitorDocumentList.reducer";
import { visitorDocumentTypeReducer } from "./Document/visitorDocumentType.reducer";
import { visitorSubStatusReducer } from "./Visitor/VisitorSubStatus.reducer";
import { visitorMainStatusReducer } from "./Visitor/VisitorMainStatus.reducer";

const rootReducer = combineReducers({
  admin: adminReducer,
  // theme: themeReducer,
  courseFinder:createCourseFinderReducer,
  country:countryReducer,
  city:cityReducer,
  state:stateReducer,
  qualification:qualificationReducer,
  stream:streamReducer,
  institute:instituteReducer,
  intake:intakeReducer,
  course:courseReducer,
  campus:campusReducer,
  programLevel:programLevelReducer,
  requirement:requirementReducer,
  B2BAdmin:B2BAdminReducer,
  leads:LeadsReducer,
  B2BMember:B2BMemberReducer,
  leadStatus:leadStatusReducer,
  exam:examReducer,
  degree:degreeReducer,
  documentType:documentTypeReducer,
  documentList:documentListReducer,
  countryDocument:countryDocumentReducer,
  inquiry:inquiryReducer,
  studentApplication:studentApplicationReducer,
  setting:settingReducer,
  rolePermission:rolePermissionReducer,
  tag:TagReducer,
  progressbar:progressbarReducer,
  branch:branchReducer,
  whatsappTemplate:WhatsappTemplateReducer,
  whatsappCategory:WhatsappCategoryReducer,
  applicationStatus:applicationStatusReducer,
  studentStatus:studentStatusReducer,
  promotionalDocument:PromotionalDocumentReducer,
  promotionalTutorial:PromotionalTutorialReducer,
  tutorial:TutorialReducer,
  visitorDocument:VisitorDocumentReducer,
  workPermitDocument:WorkPermitDocumentReducer,
  socialMediaPromotion: socialMediaPromotionReducer,
  promotionalPpt:promotionalPptReducer,
  account:totalAdmissionReducer,
  universityCommission:universityCommissionReducer,
  visaStatus: visaStatusReducer,
  accountantStatus: accountantStatusReducer,
  currencyRate: currencyRateReducer,
  expenseType: expenseTypeReducer,
  expenses:expenseReducer,
  generateInvoice:generateInvoiceReducer,
  leadReports:leadReportsReducer,
  studentApplicationReports:studentApplicationReportReducer,
  coachingFaculty:coachingFacultyReducer,
  contact:contactReducer,
  group:groupReducers,
  template:templateReducer,
  compaign:campaignReducer,
  credential:credentialReducer,
  visitorApplication:visitorApplicationReducer,
  visitorDocumentList:visitorDocumentListReducer,
  visitorDocumentType:visitorDocumentTypeReducer,
  visitorSubStatus:visitorSubStatusReducer,
  visitorMainStatus:visitorMainStatusReducer
});

export default rootReducer;
