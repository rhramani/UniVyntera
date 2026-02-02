import {
  CREATE_EXPENSES,
  DELETE_EXPENSES,
  EXPENSES_EXPORT_REPORT,
  GET_ALL_EXPENSES,
  GET_ONE_EXPENSES,
  UPDATE_EXPENSES,
} from "../../actions/Report/Expenses.action";

const initialState = {
  createExpense: "",
  updateExpense: "",
  getAllExpense: "",
  deleteExpense: "",
  exportReportExpense: "",
};

export const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EXPENSES:
      return { ...state, createExpense: action.payload };
    case UPDATE_EXPENSES:
      return { ...state, updateExpense: action.payload };
    case GET_ALL_EXPENSES:
      return { ...state, getAllExpense: action.payload };
    case DELETE_EXPENSES:
      return { ...state, deleteExpense: action.payload };
    case EXPENSES_EXPORT_REPORT:
      return { ...state, exportReportExpense: action.payload };  
    default:
      return state;
  }
};
