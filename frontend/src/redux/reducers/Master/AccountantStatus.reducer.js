import { CREATE_ACCOUNTANT_STATUS, DELETE_ACCOUNTANT_STATUS, GET_ALL_ACCOUNTANT_STATUS, UPDATE_ACCOUNTANT_STATUS } from "../../actions/Master/AccountantStatus.action";

const initialState = {
  createAccountantStatus: "",
  updateAccountantStatus: "",
  deleteAccountantStatus: "",
  getAllAccountantStatus: "",
};

export const accountantStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ACCOUNTANT_STATUS:
      return { ...state, createAccountantStatus: action.payload };
    case UPDATE_ACCOUNTANT_STATUS:
      return { ...state, updateAccountantStatus: action.payload };
    case GET_ALL_ACCOUNTANT_STATUS:
      return { ...state, getAllAccountantStatus: action.payload };
    case DELETE_ACCOUNTANT_STATUS:
      return { ...state, deleteAccountantStatus: action.payload };
    default:
      return state;
  }
};
