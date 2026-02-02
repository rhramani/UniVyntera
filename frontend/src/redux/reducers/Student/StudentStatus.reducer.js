import { CREATE_STUDENT_STATUS, DELETE_STUDENT_STATUS, GET_ALL_STUDENT_STATUS, GET_ONE_STUDENT_STATUS, UPDATE_STUDENT_STATUS } from "../../actions/Student/StudentStatus.action";

const initialState = {
  createStudentStatus: "",
  updateStudentStatus: "",
  getOneStudentStatus: "",
  getAllStudentStatus: "",
  deleteStudentStatus: "",
};

export const studentStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_STUDENT_STATUS:
      return { ...state, createStudentStatus: action.payload };
    case UPDATE_STUDENT_STATUS:
      return { ...state, updateStudentStatus: action.payload };
    case GET_ONE_STUDENT_STATUS:
      return { ...state, getOneStudentStatus: action.payload };
    case GET_ALL_STUDENT_STATUS:
      return { ...state, getAllStudentStatus: action.payload };
    case DELETE_STUDENT_STATUS:
      return { ...state, deleteStudentStatus: action.payload };
    default:
      return state;
  }
}
