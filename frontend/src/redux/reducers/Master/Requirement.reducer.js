import {
  CREATE_REQUIREMENT,
  DELETE_REQUIREMENT,
  GET_ALL_REQUIREMENT,
  UPDATE_REQUIREMENT,
} from "../../actions/Master/Requirement.action";

const initialState = {
  createRequirement: "",
  updateRequirement: "",
  getAllRequirement: "",
  deleteRequirement: "",
};

export const requirementReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REQUIREMENT:
      return { ...state, createRequirement: action.payload };
    case UPDATE_REQUIREMENT:
      return { ...state, updateRequirement: action.payload };
    case GET_ALL_REQUIREMENT:
      return { ...state, getAllRequirement: action.payload };
    case DELETE_REQUIREMENT:
      return { ...state, deleteRequirement: action.payload };
    default:
      return state;
  }
};
