import { CREATE_EXPENSE_TYPE, DELETE_EXPENSE_TYPE, GET_ALL_EXPENSE_TYPE, UPDATE_EXPENSE_TYPE } from "../../actions/Master/ExpenseType.action";

const initialState = {
  createExpenseType: "",
  updateExpenseType: "",
  getAllExpenseType: "",
  deleteExpenseType: "",
};

export const expenseTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EXPENSE_TYPE:
      return { ...state, createExpenseType: action.payload };
    case UPDATE_EXPENSE_TYPE:
      return { ...state, updateExpenseType: action.payload };
    case GET_ALL_EXPENSE_TYPE:
      return { ...state, getAllExpenseType: action.payload };
    case DELETE_EXPENSE_TYPE:
      return { ...state, deleteExpenseType: action.payload };
    default:
      return state;
  }
};
