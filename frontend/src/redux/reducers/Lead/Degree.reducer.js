import {
    CREATE_DEGREE,
    UPDATE_DEGREE,
    GET_ALL_DEGREE,
    DELETE_DEGREE,
} from "../../actions/Lead/Degree.action";

const initialState = {
  CreateDegree: "",
  UpdateDegree: "",
  GetAllDegree: "",
  DeleteDegree: "",
};

export const degreeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_DEGREE:
      return { ...state, CreateDegree: action.payload };
    case UPDATE_DEGREE:
      return { ...state, UpdateDegree: action.payload };
    case GET_ALL_DEGREE:
      return { ...state, GetAllDegree: action.payload };
    case DELETE_DEGREE:
      return { ...state, DeleteDegree: action.payload };
    default:
      return state;
  }
};
