import {
  CREATE_QUALIFICATION,
  DELETE_QUALIFICATION,
  GET_ALL_QUALIFICATION,
  UPDATE_QUALIFICATION,
} from "../../actions/Master/Qualification.action";

const initialState = {
  CreateQualification: "",
  UpdateQualification: "",
  GetAllQualification: "",
  DeleteQualification: "",
};

export const qualificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_QUALIFICATION:
      return { ...state, CreateQualification: action.payload };
    case UPDATE_QUALIFICATION:
      return { ...state, UpdateQualification: action.payload };
    case GET_ALL_QUALIFICATION:
      return { ...state, GetAllQualification: action.payload };
    case DELETE_QUALIFICATION:
      return { ...state, DeleteQualification: action.payload };
    default:
      return state;
  }
};
