import {
  CREATE_COACHING_FACULTY,
  DELETE_COACHING_FACULTY,
  GET_ALL_BATCH_TIMES,
  GETALL_COACHING_FACULTY,
  UPDATE_COACHING_FACULTY,
} from "../../actions/Master/CoachingFaculty.action";

const initialState = {
  createCoachingFaculty: "",
  updateCoachingFaculty: "",
  getAllCoachingFaculty: "",
  deleteCoachingFaculty: "",
  getAllBatchTimes: "",
};

export const coachingFacultyReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COACHING_FACULTY:
      return { ...state, CreateCoachingFaculty: action.payload };
    case UPDATE_COACHING_FACULTY:
      return { ...state, CreateCoachingFaculty: action.payload };
    case GETALL_COACHING_FACULTY:
      return { ...state, CreateCoachingFaculty: action.payload };
    case DELETE_COACHING_FACULTY:
      return { ...state, CreateCoachingFaculty: action.payload };
    case GET_ALL_BATCH_TIMES:
      return { ...state, GetAllBatchTimes: action.payload };  
    default:
      return state;
  }
};
