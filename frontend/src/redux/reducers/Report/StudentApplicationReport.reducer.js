import {
  DOWNLOAD_STUDENT_APPLICATION_DATA,
  EXPORT_FEE_PAYMENT_REPORT,
  EXPORT_MOST_PREFERRED_COURSE,
  EXPORT_PENDING_AGREEMENT,
  EXPORT_STUDENT_FINANCE_SUMMARY_REPORT,
  EXPORT_UNIVERSITY_PAYMENT_COLLECTION_REPORT,
  GET_ALL_INSTITUTE,
  GET_ALL_INTAKE,
  GET_ALL_MOST_PREFERRED_COURSE,
  GET_ALL_PENDING_AGREEMENT,
  GET_ALL_STUDENT_REPORT,
  GET_FEE_PAYMENT_REPORT,
  GET_FILTER_OPTION,
  GET_STUDENT_FINANCE_SUMMARY_REPORT,
  GET_UNIVERSITY_PAYMENT_COLLECTION_REPORT,
  PARTNER_COMMISSION_REPORT,
  PARTNER_CONVERSION_REPORT,
  PARTNER_CONVERSION_REPORT_EXPORT,
  TOTAL_PENDING_B2B_COUNTRY,
  PARTNER_PENDING_B2B_INVOICE,
  PARTNER_UNIQUE_B2B_AND_BRANCH_LIST,
  PARTNER_UNIQUE_B2B_LIST,
  PARTNER_UNIQUE_BRANCH_LIST,
  UNIQUE_PREFERRED_COUNTRIES,
  UNIVERSITY_COMMISSION_REPORT,
  GET_VISA_PROCESS_REPORT,
  EXPORT_VISA_PROCESS_REPORT,
} from "../../actions/Report/StudentApplicationReport.action";

const initialState = {
  getAllIntake: "",
  getAllInstitute: "",
  getAllStudentReport: "",
  umiquePreferredCountries: "",
  getAllPendingAgreement: "",
  getAllMostPreferredCourse: "",
  downloadStudentApplicationData: "",
  exportMostPreferredCourse: "",
  exportPendingAgreement: "",
  getFilterOption: "",
  partnerCommissionReport: "",
  partnerPendingB2BInvoice: "",
  partnerUniqueB2BAndBranchList: "",
  partnerConversionReport: "",
  partnerConversionReportExport: "",
  totalPendingB2BCountry: "",
  universityCommissionReport: "",
  feePaymentReport: "",
  studentFinanceSummaryReport: "",
  universityPaymentCollectionReport: "",
  exportFeePaymentReport: "",
  exportStudentFinanceSummaryReport: "",
  exportUniversityPaymentCollectionReport: "",
  visaProcessReport: "",
  exportVisaProcessReport: "",
};

export const studentApplicationReportReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case GET_ALL_INTAKE:
      return { ...state, getAllIntake: action.payload };
    case GET_ALL_INSTITUTE:
      return { ...state, getAllInstitute: action.payload };
    case GET_ALL_STUDENT_REPORT:
      return { ...state, getAllStudentReport: action.payload };
    case UNIQUE_PREFERRED_COUNTRIES:
      return { ...state, umiquePreferredCountries: action.payload };
    case GET_ALL_PENDING_AGREEMENT:
      return { ...state, getAllPendingAgreement: action.payload };
    case GET_ALL_MOST_PREFERRED_COURSE:
      return { ...state, getAllMostPreferredCourse: action.payload };
    case DOWNLOAD_STUDENT_APPLICATION_DATA:
      return { ...state, downloadStudentApplicationData: action.payload };
    case EXPORT_MOST_PREFERRED_COURSE:
      return { ...state, exportMostPreferredCourse: action.payload };
    case EXPORT_PENDING_AGREEMENT:
      return { ...state, exportPendingAgreement: action.payload };
    case GET_FILTER_OPTION:
      return { ...state, getFilterOption: action.payload };
    case PARTNER_COMMISSION_REPORT:
      return { ...state, partnerCommissionReport: action.payload };
    case PARTNER_PENDING_B2B_INVOICE:
      return { ...state, partnerPendingB2BInvoice: action.payload };
    case PARTNER_UNIQUE_B2B_AND_BRANCH_LIST:
      return { ...state, partnerUniqueB2BAndBranchList: action.payload };
    case PARTNER_CONVERSION_REPORT:
      return { ...state, partnerConversionReport: action.payload };
    case PARTNER_CONVERSION_REPORT_EXPORT:
      return { ...state, partnerConversionReportExport: action.payload };
    case TOTAL_PENDING_B2B_COUNTRY:
      return { ...state, totalPendingB2BCountry: action.payload };  
    case UNIVERSITY_COMMISSION_REPORT:
      return { ...state, universityCommissionReport: action.payload };
    case GET_FEE_PAYMENT_REPORT:
      return { ...state, feePaymentReport: action.payload };
    case GET_STUDENT_FINANCE_SUMMARY_REPORT:
      return { ...state, studentFinanceSummaryReport: action.payload };
    case GET_UNIVERSITY_PAYMENT_COLLECTION_REPORT:
      return { ...state, universityPaymentCollectionReport: action.payload };
    case EXPORT_FEE_PAYMENT_REPORT:
      return { ...state, exportFeePaymentReport: action.payload };
    case EXPORT_STUDENT_FINANCE_SUMMARY_REPORT:
      return { ...state, exportStudentFinanceSummaryReport: action.payload };
    case EXPORT_UNIVERSITY_PAYMENT_COLLECTION_REPORT:
      return {
        ...state,
        exportUniversityPaymentCollectionReport: action.payload,
      };
    case GET_VISA_PROCESS_REPORT:
      return { ...state, visaProcessReport: action.payload };  
    case EXPORT_VISA_PROCESS_REPORT:
      return { ...state, exportVisaProcessReport: action.payload };  
    default:
      return state;
  }
};
