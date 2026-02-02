import {
  CREATE_COURSE,
  DELETE_COURSE,
  GET_ALL_COURSE,
  UPDATE_COURSE,
} from "../../actions/Master/Course.action";

const initialState = {
  CreateCourse: "",
  UpdateCourse: "",
  GetAllCourse: "",
  DeleteCourse: "",
};

export const courseReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COURSE:
      return { ...state, CreateCourse: action.payload };
    case UPDATE_COURSE:
      return { ...state, UpdateCourse: action.payload };
    case GET_ALL_COURSE:
      return { ...state, GetAllCourse: action.payload };
    case DELETE_COURSE:
      return { ...state, DeleteCourse: action.payload };
    default:
      return state;
  }
};
