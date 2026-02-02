import {
  CREATE_CAMPUS,
  DELETE_CAMPUS,
  GET_ALL_CAMPUS,
  GET_CAMPUS,
  UPDATE_CAMPUS,
} from "../../actions/Master/Campus.action";

const initialState = {
  CreateCampus: "",
  UpdateCampus: "",
  GetAllCampus: "",
  DeleteCampus: "",
  GetCampus: "",
};

export const campusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CAMPUS:
      return { ...state, CreateCampus: action.payload };
    case UPDATE_CAMPUS:
      return { ...state, UpdateCampus: action.payload };
    case GET_ALL_CAMPUS:
      return { ...state, GetAllCampus: action.payload };
    case DELETE_CAMPUS:
      return { ...state, DeleteCampus: action.payload };
    case GET_CAMPUS:
      return { ...state, GetCampus: action.payload };
    default:
      return state;
  }
};
