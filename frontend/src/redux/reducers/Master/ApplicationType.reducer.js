import {
  CREATE_APPLICATION_TYPE,
  DELETE_APPLICATION_TYPE,
  GET_ALL_APPLICATION_TYPE,
  UPDATE_APPLICATION_TYPE,
} from "../../actions/Master/ApplicationType.action";

const initialState = {
  CreateApplicationType: "",
  UpdateApplicationType: "",
  GetAllApplicationType: "",
  DeleteApplicationType: "",
};

export const applicationTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_APPLICATION_TYPE:
      return { ...state, CreateApplicationType: action.payload };
    case UPDATE_APPLICATION_TYPE:
      return { ...state, UpdateApplicationType: action.payload };
    case GET_ALL_APPLICATION_TYPE:
      return { ...state, GetAllApplicationType: action.payload };
    case DELETE_APPLICATION_TYPE:
      return { ...state, DeleteApplicationType  : action.payload };
    default:
      return state;
  }
};
