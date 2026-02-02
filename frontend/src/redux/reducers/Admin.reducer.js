import {
  DELETE_ADMIN,
  GET_ALL_ADMIN,
  GET_ALL_MEMBER,
  GET_ONE_ADMIN,
  LOGIN_ADMIN,
  LOGIN_HISTORY,
  REGISTER_ADMIN,
  REQUEST_OTP_ADMIN,
  UPDATE_ADMIN,
} from "../actions/Admin.action";

const initialState = {
  LoginAdmin: "",
  RegisterAdmin: "",
  RequestOTPAdmin: "",
  UpdateAdmin: "",
  GetAllAdmin: "",
  GetOneAdmin: "",
  DeleteAdmin: "",
  LoginHistoryAdmin: "",
  GetAllMember: "",
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_ADMIN:
      return { ...state, LoginAdmin: action.payload };
    case REGISTER_ADMIN:
      return { ...state, RegisterAdmin: action.payload };
    case REQUEST_OTP_ADMIN:
      return { ...state, RequestOTPAdmin: action.payload };
    case UPDATE_ADMIN:
      return { ...state, UpdateAdmin: action.payload };
    case GET_ALL_ADMIN:
      return { ...state, GetAllAdmin: action.payload };
    case GET_ONE_ADMIN:
      return { ...state, GetOneAdmin: action.payload };
    case DELETE_ADMIN:
      return { ...state, DeleteAdmin: action.payload };
    case LOGIN_HISTORY:
      return { ...state, LoginHistoryAdmin: action.payload };
    case GET_ALL_MEMBER:
      return { ...state, GetAllMember: action.payload };
    default:
      return state;
  }
};
