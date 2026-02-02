import { GET_ALL_UNIVERSITY_COMMISSION, GET_TOTAL_COMMISSION_UNIVERSITY, GET_TOTAL_COMMISSION_COUNTRY, GET_TOTAL_B2B_COMMISSION, COMMISSION_EDIT_INVOICE, UPDATE_STUDENT_INVOICE, DELETE_STUDENT_INVOICE, GET_ALL_STUDENT_INVOICE, CREATE_STUDENT_INVOICE, STUDENT_INVOICE_REPORT_EXPORT } from "../../actions/Accountant/UniversityCom.action";


const initialState = {
  getAllUniversityCommission: "",
  getTotalCommissionUniversity: "",
  getTotalCommissionCountry: "",
  commissionQueryMail: "",
  commissionEditInvoice: "",
  studentByB2B: "",
  createStudentInvoice: "",
  getAllStudentInvoice: "",
  updateStudentInvoice: "",
  deleteStudentInvoice: "",
  studentInvoiceReportExport: "",
};

export const universityCommissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_UNIVERSITY_COMMISSION:
      return { ...state, getAllUniversityCommission: action.payload };
    case GET_TOTAL_COMMISSION_UNIVERSITY:
      return { ...state, getTotalCommissionUniversity: action.payload };
    case GET_TOTAL_COMMISSION_COUNTRY:
      return { ...state, getTotalCommissionCountry: action.payload };
    case GET_TOTAL_B2B_COMMISSION:
      return { ...state, getTotalB2BCommission: action.payload };
    case COMMISSION_QUERY_MAIL:
      return { ...state, commissionQueryMail: action.payload };
    case COMMISSION_EDIT_INVOICE:
      return { ...state, commissionEditInvoice: action.payload };
    case STUDENT_BY_B2B:
      return { ...state, studentByB2B: action.payload };
    case CREATE_STUDENT_INVOICE:
      return { ...state, createStudentInvoice: action.payload };
    case UPDATE_STUDENT_INVOICE:
      return { ...state, updateStudentInvoice: action.payload };
    case DELETE_STUDENT_INVOICE:
      return { ...state, deleteStudentInvoice: action.payload };
    case GET_ALL_STUDENT_INVOICE:
      return { ...state, getAllStudentInvoice: action.payload };
    case STUDENT_INVOICE_REPORT_EXPORT:
      return { ...state, studentInvoiceReportExport: action.payload };  
    default:
      return state;
  }
};
