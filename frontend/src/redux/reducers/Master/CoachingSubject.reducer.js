import { CREATE_SUBJECT, DELETE_SUBJECT, GET_ALL_SUBJECT, UPDATE_SUBJECT } from "../../actions/Master/CoachingSubject.action";

const initialState = {
  CreateSubject: "",
  UpdateSubject: "",
  GetAllSubject: "",
  DeleteSubject: "",
};

export const subjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SUBJECT:
      return { ...state, CreateSubject: action.payload };
    case UPDATE_SUBJECT:
      return { ...state, UpdateSubject: action.payload };
    case GET_ALL_SUBJECT:
      return { ...state, GetAllSubject: action.payload };
    case DELETE_SUBJECT:
      return { ...state, DeleteSubject: action.payload };
    default:
      return state;
  }
};
