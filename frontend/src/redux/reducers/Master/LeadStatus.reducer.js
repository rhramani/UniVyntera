import {
  CREATE_LEAD_STATUS,
  DELETE_LEAD_STATUS,
  GET_ALL_LEAD_STATUS,
  GET_ONE_LEAD_STATUS,
  UPDATE_LEAD_STATUS,
  CREATE_B2B_LEAD_STATUS,
  UPDATE_B2B_LEAD_STATUS,
  GET_ONE_B2B_LEAD_STATUS,
  GET_ALL_B2B_LEAD_STATUS,
  DELETE_B2B_LEAD_STATUS,
} from "../../actions/Master/LeadStatus.action";

const initialState = {
  createLeadStatus: "",
  updateLeadStatus: "",
  getOneLeadStatus: "",
  getAllLeadStatus: "",
  deleteLeadStatus: "",
  // b2b lead status
  createB2BLeadStatus: "",
  updateB2BLeadStatus: "",
  getOneB2BLeadStatus: "",
  getAllB2BLeadStatus: "",
  deleteB2BLeadStatus: "",
};

export const leadStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LEAD_STATUS:
      return { ...state, createLeadStatus: action.payload };
    case UPDATE_LEAD_STATUS:
      return { ...state, updateLeadStatus: action.payload };
    case GET_ONE_LEAD_STATUS:
      return { ...state, getOneLeadStatus: action.payload };
    case GET_ALL_LEAD_STATUS:
      return { ...state, getAllLeadStatus: action.payload };
    case DELETE_LEAD_STATUS:
      return { ...state, deleteLeadStatus: action.payload };
    // b2b lead status
    case CREATE_B2B_LEAD_STATUS:
      return { ...state, createB2BLeadStatus: action.payload };
    case UPDATE_B2B_LEAD_STATUS:
      return { ...state, updateB2BLeadStatus: action.payload };
    case GET_ONE_B2B_LEAD_STATUS:
      return { ...state, getOneB2BLeadStatus: action.payload };
    case GET_ALL_B2B_LEAD_STATUS:
      return { ...state, getAllB2BLeadStatus: action.payload };
    case DELETE_B2B_LEAD_STATUS:
      return { ...state, deleteB2BLeadStatus: action.payload };
    default:
      return state;
  }
};
