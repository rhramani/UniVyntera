import {
  CREATE_COACHING_REQUIREMENT,
  DELETE_COACHING_REQUIREMENT,
  GETALL_COACHING_REQUIREMENT,
  UPDATE_COACHING_REQUIREMENT,
} from "../../actions/Master/CoachingRequirement.action";

const initialState = {
  createCoachingRequirement: "",
  updateCoachingRequirement: "",
  getAllCoachingRequirement: "",
  deleteCoachingRequirement: "",
};

export const coachingRequirementReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COACHING_REQUIREMENT:
      return { ...state, CreateCoachingRequirement: action.payload };
    case UPDATE_COACHING_REQUIREMENT:
      return { ...state, CreateCoachingRequirement: action.payload };
    case GETALL_COACHING_REQUIREMENT:
      return { ...state, CreateCoachingRequirement: action.payload };
    case DELETE_COACHING_REQUIREMENT:
      return { ...state, CreateCoachingRequirement: action.payload };
    default:
      return state;
  }
};
