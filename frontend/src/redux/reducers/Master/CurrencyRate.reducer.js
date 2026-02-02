import { BULK_UPLOAD_CURRENCY_RATE, CREATE_CURRENCY_RATE, DELETE_CURRENCY_RATE, GET_ALL_CURRENCY_RATE, GET_ONE_CURRENCY_RATE, UPDATE_CURRENCY_RATE } from "../../actions/Master/CurrencyRate.action";

const initialState = {
  createCurrencyRate: "",
  updateCurrencyRate: "",
  deleteCurrencyRate: "",
  getAllCurrencyRate: "",
  getOneCurrencyRate: "",
  getOneCurrencyRate: "",
  bulkUploadCurrencyRate: "",
};

export const currencyRateReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CURRENCY_RATE:
      return { ...state, createCurrencyRate: action.payload };
    case UPDATE_CURRENCY_RATE:
      return { ...state, updateCurrencyRate: action.payload };
    case GET_ALL_CURRENCY_RATE:
      return { ...state, getAllCurrencyRate: action.payload };
    case GET_ONE_CURRENCY_RATE:
      return { ...state, getOneCurrencyRate: action.payload };
    case DELETE_CURRENCY_RATE:
      return { ...state, deleteCurrencyRate: action.payload };
    case BULK_UPLOAD_CURRENCY_RATE:
      return { ...state, bulkUploadCurrencyRate: action.payload };
    default:
      return state;
  }
};
