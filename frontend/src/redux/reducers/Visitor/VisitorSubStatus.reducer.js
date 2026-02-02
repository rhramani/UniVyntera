import {
  CREATE_VISITOR_SUB_STATUS,
  DELETE_VISITOR_SUB_STATUS,
  GET_ALL_VISITOR_SUB_STATUS,
  UPDATE_VISITOR_SUB_STATUS,
} from "../../actions/Visitor/VisitorSubStatus.action";

const initialState = {
  createSubStatus: "",
  updateSubStatus: "",
  getAllSubStatus: "",
  deleteSubStatus: "",
};

export const visitorSubStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VISITOR_SUB_STATUS:
      return { ...state, createSubStatus: action.payload };
    case UPDATE_VISITOR_SUB_STATUS:
      return { ...state, updateSubStatus: action.payload };
    case GET_ALL_VISITOR_SUB_STATUS:
      return { ...state, getAllSubStatus: action.payload };
    case DELETE_VISITOR_SUB_STATUS:
      return { ...state, deleteSubStatus: action.payload };
    default:
      return state;
  }
};
