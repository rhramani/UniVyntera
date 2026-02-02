import {
  CREATE_STUDENT_RAGISTER_FOR,
  DELETE_STUDENT_RAGISTER_FOR,
  GETALL_STUDENT_RAGISTER_FOR,
  UPDATE_STUDENT_RAGISTER_FOR,
} from "../../actions/Master/CoachingRequirement.action";

const initialState = {
  createCoachingRequirement: "",
  updateCoachingRequirement: "",
  getAllCoachingRequirement: "",
  deleteCoachingRequirement: "",
};

export const coachingRequirementReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_STUDENT_RAGISTER_FOR:
      return { ...state, CreateCoachingRequirement: action.payload };
    case UPDATE_STUDENT_RAGISTER_FOR:
      return { ...state, CreateCoachingRequirement: action.payload };
    case GETALL_STUDENT_RAGISTER_FOR:
      return { ...state, CreateCoachingRequirement: action.payload };
    case DELETE_STUDENT_RAGISTER_FOR:
      return { ...state, CreateCoachingRequirement: action.payload };
    default:
      return state;
  }
};
