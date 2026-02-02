import {
  CREATE_APPLICATION_STATUS,
  DELETE_APPLICATION_STATUS,
  GET_ALL_APPLICATION_STATUS,
  GET_ONE_APPLICATION_STATUS,
  UPDATE_APPLICATION_STATUS,
} from "../../actions/Student/ApplicationStatus.action";

const initialState = {
  createApplicationStatus: "",
  updateApplicationStatus: "",
  getOneApplicationStatus: "",
  getAllApplicationStatus: "",
  deleteApplicationStatus: "",
};

export const applicationStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_APPLICATION_STATUS:
      return { ...state, createApplicationStatus: action.payload };
    case UPDATE_APPLICATION_STATUS:
      return { ...state, updateApplicationStatus: action.payload };
    case GET_ONE_APPLICATION_STATUS:
      return { ...state, getOneApplicationStatus: action.payload };
    case GET_ALL_APPLICATION_STATUS:
      return { ...state, getAllApplicationStatus: action.payload };
    case DELETE_APPLICATION_STATUS:
      return { ...state, deleteApplicationStatus: action.payload };
    default:
      return state;
  }
}
