import {
  CREATE_EDUCATION_LOAN_STATUS,
  DELETE_EDUCATION_LOAN_STATUS,
  GET_ALL_EDUCATION_LOAN_STATUS,
  GET_ONE_EDUCATION_LOAN_STATUS,
  UPDATE_EDUCATION_LOAN_STATUS,
} from "../../actions/Master/EducationLoanStatus.action";

const initialState = {
  createEducationLoanStatus: "",
  updateEducationLoanStatus: "",
  deleteEducationLoanStatus: "",
  getAllEducationLoanStatus: "",
};

export const accountantStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EDUCATION_LOAN_STATUS:
      return { ...state, createAccountantStatus: action.payload };
    case UPDATE_EDUCATION_LOAN_STATUS:
      return { ...state, updateAccountantStatus: action.payload };
    case GET_ALL_EDUCATION_LOAN_STATUS:
      return { ...state, getAllAccountantStatus: action.payload };
    case GET_ONE_EDUCATION_LOAN_STATUS:
      return { ...state, getAllAccountantStatus: action.payload };
    case DELETE_EDUCATION_LOAN_STATUS:
      return { ...state, deleteAccountantStatus: action.payload };
    default:
      return state;
  }
};
