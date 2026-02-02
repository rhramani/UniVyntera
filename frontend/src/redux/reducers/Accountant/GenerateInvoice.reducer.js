import {
  CREATE_GENERATE_INVOICE,
  DELETE_GENERATE_INVOICE,
  EXPORT_REPORT_GENERATE_INVOICE,
  GET_ALL_GENERATE_INVOICE,
  UNIQUE_STUDENT,
  UPDATE_GENERATE_INVOICE,
  GET_ALL_TOTAL_BANK_CASH,
  CREATE_TRANSFER,
  GET_FUND_TRANSFER_HISTORY
} from "../../actions/Accountant/GenerateInvoice.action";

const initialState = {
  createGenerateInvoice: "",
  getAllGenerateInvoice: "",
  updateGenerateInvoice: "",
  deleteGenerateInvoice: "",
  uniqueStudent: "",
  exportGenerateInvoice: "",
  getAllTotalBankCash: "",
  createTransfer: "",
  getFundTransferHistory: "",
};

export const generateInvoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GENERATE_INVOICE:
      return { ...state, createGenerateInvoice: action.payload };
    case GET_ALL_GENERATE_INVOICE:
      return { ...state, getAllGenerateInvoice: action.payload };
    case UPDATE_GENERATE_INVOICE:
      return { ...state, updateGenerateInvoice: action.payload };
    case DELETE_GENERATE_INVOICE:
      return { ...state, deleteGenerateInvoice: action.payload };
    case UNIQUE_STUDENT:
      return { ...state, uniqueStudent: action.payload };
    case EXPORT_REPORT_GENERATE_INVOICE:
      return { ...state, exportGenerateInvoice: action.payload };  
    case GET_ALL_TOTAL_BANK_CASH:
      return { ...state, getAllTotalBankCash: action.payload };
    case CREATE_TRANSFER:
      return { ...state, createTransfer: action.payload };
    case GET_FUND_TRANSFER_HISTORY:
      return { ...state, getFundTransferHistory: action.payload };  
    default:
      return state;
  }
};
