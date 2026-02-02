import {
  ADD_LEAD,
  GET_LEAD,
  GET_LEAD_BY_ID,
  UPDATE_LEAD,
  DELETE_LEAD,
  FILTER_WISE_DATA,
  DOWNLOAD_DATA,
  INSERT_MANY,
  DELETE_MANY_LEAD,
  GET_ALL_COUNSELLOR,
  FOLLOW_UP_LEAD_BY_DATE,
  FOLLOW_UP_LEAD,
  EDIT_HISTORY,
  CONVERT_TO_APPLICATION,
  GET_LEAD_BY_ASSIGN_USER_ID,
  GET_LEAD_BY_ASSIGN_USER,
  SEND_WP_MESSAGE,
  GET_LEAD_FROM,
  GET_LEAD_COUNTRY,
  GET_TODAYS_BIRTHDAY_LEAD,
  GET_B2B_LEAD,
  GET_PENDING_FOLLOW_UPS,
  GET_APPLICATION_PROCESS,
  ADD_CTC_CALLING,
} from "../actions/Lead.action";

const initialState = {
  leadAdd: "",
  getLeadData: "",
  getLeadDataById: "",
  updateLead: "",
  deleteLead: "",
  downloadLead: "",
  insertMany: "",
  deleteManyLead: "",
  getAllCounsellorList: "",
  getFollowUpLeadByDate: "",
  getFollowUpLead: "",
  editHistory: "",
  convertToApplication: "",
  getLeadByAssignUserId: "",
  getLeadByAssignUser: "",
  sendWPMessage: "",
  getLeadFrom: "",
  getLeadCountry: "",
  getTodaysBirthdayLead: "",
  getB2BLead: "",
  getPendingFollowUps: "",
  applicationProcess: "",
  addCtcCalling: "",
};

export const LeadsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LEAD:
      return { ...state, leadAdd: action.payload };
    case GET_LEAD:
      return { ...state, getLeadData: action.payload };
    case GET_LEAD_BY_ID:
      return { ...state, getLeadDataById: action.payload };
    case UPDATE_LEAD:
      return { ...state, updateLead: action.payload };
    case DELETE_LEAD:
      return { ...state, deleteLead: action.payload };
    case FILTER_WISE_DATA:
      return { ...state, getLeadData: action.payload };
    case DOWNLOAD_DATA:
      return { ...state, downloadLead: action.payload };
    case INSERT_MANY:
      return { ...state, insertMany: action.payload };
    case DELETE_MANY_LEAD:
      return { ...state, deleteManyLead: action.payload };
    case GET_ALL_COUNSELLOR:
      return { ...state, getAllCounsellorList: action.payload };
    case FOLLOW_UP_LEAD_BY_DATE:
      return { ...state, getFollowUpLeadByDate: action.payload };
    case FOLLOW_UP_LEAD:
      return { ...state, getFollowUpLead: action.payload };
    case EDIT_HISTORY:
      return { ...state, editHistory: action.payload };
    case CONVERT_TO_APPLICATION:
      return { ...state, convertToApplication: action.payload };
    case GET_LEAD_BY_ASSIGN_USER_ID:
      return { ...state, getLeadByAssignUserId: action.payload };
    case GET_LEAD_BY_ASSIGN_USER:
      return { ...state, getLeadByAssignUser: action.payload };
    case SEND_WP_MESSAGE:
      return { ...state, sendWPMessage: action.payload };
    case GET_LEAD_FROM:
      return { ...state, getLeadFrom: action.payload };
    case GET_LEAD_COUNTRY:
      return { ...state, getLeadCountry: action.payload };
    case GET_TODAYS_BIRTHDAY_LEAD:
      return { ...state, getTodaysBirthdayLead: action.payload };
    case GET_B2B_LEAD:
      return { ...state, getB2BLead: action.payload };
    case GET_PENDING_FOLLOW_UPS:
      return { ...state, getPendingFollowUps: action.payload };
    case GET_APPLICATION_PROCESS:
      return { ...state, applicationProcess: action.payload };
    case ADD_CTC_CALLING:
      return { ...state, addCtcCalling: action.payload };
    default:
      return state;
  }
};
