import {
    CREATE_EXAM,
    UPDATE_EXAM,
    GET_ALL_EXAM,
    DELETE_EXAM,
} from "../../actions/Lead/Exam.action";

const initialState = {
  CreateExam: "",
  UpdateExam: "",
  GetAllExam: "",
  DeleteExam: "",
};

export const examReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EXAM:
      return { ...state, CreateExam: action.payload };
    case UPDATE_EXAM:
      return { ...state, UpdateExam: action.payload };
    case GET_ALL_EXAM:
      return { ...state, GetAllExam: action.payload };
    case DELETE_EXAM:
      return { ...state, DeleteExam: action.payload };
    default:
      return state;
  }
};
