import {
  CREATE_LOAN_PROVIDER,
  UPDATE_LOAN_PROVIDER,
  GET_ONE_LOAN_PROVIDER,
  GET_ALL_LOAN_PROVIDER,
  DELETE_LOAN_PROVIDER,
} from "../../actions/Master/LoanProvider.action";

const initialState = {
  createloanprovider: "",
  updateloanprovider: "",
  getoneloanprovider: "",
  getallloanprovider: "",
  delereloanprovider: "",
};

export const loanProvider = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LOAN_PROVIDER:
      return { ...state, createloanprovider: action.payload };
    case UPDATE_LOAN_PROVIDER:
      return { ...state, updateloanprovider: action.payload };
    case GET_ONE_LOAN_PROVIDER:
      return { ...state, getoneloanprovider: action.payload };
    case GET_ALL_LOAN_PROVIDER:
      return { ...state, getallloanprovider: action.payload };
    case DELETE_LOAN_PROVIDER:
      return { ...state, delereloanprovider: action.payload };
    default:
      return state;
  }
};
