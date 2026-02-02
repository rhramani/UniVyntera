import {
  BULK_UPLOAD_CLIENT_MAIL,
  CREATE_CLIENT_MAIL,
  DELETE_CLIENT_MAIL,
  GET_ALL_CLIENT_MAIL,
  GET_ONE_CLIENT_MAIL,
  UPDATE_CLIENT_MAIL,
} from "../../actions/Master/ClientMail.action";

const initialState = {
  createClientMail: "",
  updateClientMail: "",
  getOneClientMail: "",
  getAllClientMail: "",
  deleteClientMail: "",
  bulkUploadClientMail: "",
};

export const clientMailReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CLIENT_MAIL:
      return { ...state, createClientMail: action.payload };
    case UPDATE_CLIENT_MAIL:
      return { ...state, updateClientMail: action.payload };
    case GET_ONE_CLIENT_MAIL:
      return { ...state, getOneClientMail: action.payload };
    case GET_ALL_CLIENT_MAIL:
      return { ...state, getAllClientMail: action.payload };
    case DELETE_CLIENT_MAIL:
      return { ...state, deleteClientMail: action.payload };
    case BULK_UPLOAD_CLIENT_MAIL:
      return { ...state, bulkUploadClientMail: action.payload };
    default:
      return state;
  }
};
