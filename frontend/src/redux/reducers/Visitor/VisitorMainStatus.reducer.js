import {
  CREATE_VISITOR_MAIN_STATUS,
  DELETE_VISITOR_MAIN_STATUS,
  GET_ALL_VISITOR_MAIN_STATUS,
  GET_ONE_VISITOR_MAIN_STATUS,
  UPDATE_VISITOR_MAIN_STATUS,
} from "../../actions/Visitor/VisitorMainStatus.action";

const initialState = {
  createMainStatus: "",
  updateMainStatus: "",
  getOneMainStatus: "",
  getAllMainStatus: "",
  deleteMainStatus: "",
};

export const visitorMainStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VISITOR_MAIN_STATUS:
      return { ...state, createMainStatus: action.payload };
    case UPDATE_VISITOR_MAIN_STATUS:
      return { ...state, updateMainStatus: action.payload };
    case GET_ONE_VISITOR_MAIN_STATUS:
      return { ...state, getOneMainStatus: action.payload };  
    case GET_ALL_VISITOR_MAIN_STATUS:
      return { ...state, getAllMainStatus: action.payload };
    case DELETE_VISITOR_MAIN_STATUS:
      return { ...state, deleteMainStatus: action.payload };
    default:
      return state;
  }
};
