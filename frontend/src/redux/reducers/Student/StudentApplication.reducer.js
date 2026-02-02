import {
  CREATE_STUDENT_APPLICATION,
  UPDATE_STUDENT_APPLICATION,
  GET_ALL_STUDENT_APPLICATION,
  GET_ONE_STUDENT_APPLICATION,
  DELETE_STUDENT_APPLICATION,
  GET_COUNTRY_WISE_DOCUMENT,
  DOWNLOAD_DOCUMENT,
  PENDING_DOC_LIST,
  PENDING_DOC_MAIL,
  GET_COACHING_STUDENT,
  GET_FOLLOWUP_STUDENT,
  CREATE_AND_UPDATE_ATTENDANCE,
  GET_ALL_ATTENDANCE,
  STUDENT_ACCOUNTANT
} from "../../actions/Student/StudentApplication.action";

const initialState = {
  CreateStudentApplication: "",
  UpdateStudentApplication: "",
  GetAllStudentApplication: "",
  GetOneStudentApplication: "",
  DeleteStudentApplication: "",
  accountantStudent:"",
  GetCountryWiseDocument: "",
  DownloadDocument: "",
  pendingDocList: "",
  pendingDocMail: "",
  coachingStudent: "",
  followupStudent: "",
  createAndUpdateAttendance: "",
  getAllAttendance: "",
};

export const studentApplicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_STUDENT_APPLICATION:
      return { ...state, CreateStudentApplication: action.payload };
    case UPDATE_STUDENT_APPLICATION:
      return { ...state, UpdateStudentApplication: action.payload };
    case GET_ALL_STUDENT_APPLICATION:
      return { ...state, GetAllStudentApplication: action.payload };
    case GET_ONE_STUDENT_APPLICATION:
      return { ...state, GetOneStudentApplication: action.payload };
    case DELETE_STUDENT_APPLICATION:
      return { ...state, DeleteStudentApplication: action.payload };
    case STUDENT_ACCOUNTANT:
      return { ...state, accountantStudent: action.payload };  
    case GET_COUNTRY_WISE_DOCUMENT:
      return { ...state, GetCountryWiseDocument: action.payload };
    case DOWNLOAD_DOCUMENT:
      return { ...state, DownloadDocument: action.payload };
    case PENDING_DOC_LIST:
      return { ...state, pendingDocList: action.payload };
    case PENDING_DOC_MAIL:
      return { ...state, pendingDocMail: action.payload };
    case GET_COACHING_STUDENT:
      return { ...state, coachingStudent: action.payload };
    case GET_FOLLOWUP_STUDENT:
      return { ...state, followupStudent: action.payload };
    case CREATE_AND_UPDATE_ATTENDANCE:
      return { ...state, createAndUpdateAttendance: action.payload };
    case GET_ALL_ATTENDANCE:
      return { ...state, getAllAttendance: action.payload };
    default:
      return state;
  }
};
