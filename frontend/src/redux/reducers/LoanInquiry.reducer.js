import { CREATE_LOAN, DELETE_LOAN, GET_ALL_LOAN, GET_ONE_LOAN, UPDATE_LOAN } from "../actions/LoanInquiry.action";

const initialState = {
  createLoan: "",
  updateLoan: "",
  getOneLoan: "",
  getAllLoan: "",
  deleteLoan: "",
};

export const LoanReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LOAN:
      return { ...state, createLoan: action.payload };
    case UPDATE_LOAN:
      return { ...state, updateLoan: action.payload };
    case GET_ONE_LOAN:
      return { ...state, getOneLoan: action.payload };
    case GET_ALL_LOAN:
      return { ...state, getAllLoan: action.payload };
    case DELETE_LOAN:
      return { ...state, deleteLoan: action.payload };
    default:
      return state;
  }
};
