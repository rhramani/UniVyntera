import {
  CREATE_CONFIGURATION,
  GET_ALL_CONFIGURATION,
  UPDATE_CONFIGURATION,
} from "../actions/Configuration.action";

const initialState = {
  createConfiguration: "",
  updateConfiguration: "",
  getAllConfiguration: "",
};

export const B2BMemberReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CONFIGURATION:
      return { ...state, createConfiguration: action.payload };
    case UPDATE_CONFIGURATION:
      return { ...state, updateConfiguration: action.payload };
    case GET_ALL_CONFIGURATION:
      return { ...state, getAllConfiguration: action.payload };
    default:
      return state;
  }
};
