import {
  CREATE_INTERESTED_COURSE_STATUS,
  DELETE_INTERESTED_COURSE_STATUS,
  GET_ALL_INTERESTED_COURSE_STATUS,
  GET_ONE_INTERESTED_COURSE_STATUS,
  UPDATE_INTERESTED_COURSE_STATUS,
} from "../../actions/Master/InterestedCourseStatus.action";

const initialState = {
  createInterestedCourseStatus: "",
  updateInterestedCourseStatus: "",
  getOneInterestedCourseStatus: "",
  getAllInterestedCourseStatus: "",
  deleteInterestedCourseStatus: "",
};

export const interestedCourseStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_INTERESTED_COURSE_STATUS:
      return { ...state, createInterestedCourseStatus: action.payload };
    case UPDATE_INTERESTED_COURSE_STATUS:
      return { ...state, updateInterestedCourseStatus: action.payload };
    case GET_ONE_INTERESTED_COURSE_STATUS:
      return { ...state, getOneInterestedCourseStatus: action.payload };
    case GET_ALL_INTERESTED_COURSE_STATUS:
      return { ...state, getAllInterestedCourseStatus: action.payload };
    case DELETE_INTERESTED_COURSE_STATUS:
      return { ...state, deleteInterestedCourseStatus: action.payload };
    default:
      return state;
  }
};
