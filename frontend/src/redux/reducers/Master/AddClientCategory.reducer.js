import {
  CREATE_CLIENT_MAIL_CATEGORY,
  DELETE_CLIENT_MAIL_CATEGORY,
  GET_ALL_CLIENT_MAIL_CATEGORY,
  UPDATE_CLIENT_MAIL_CATEGORY,
} from "../../actions/Master/AddClientCategory.action";

const initialState = {
  createClientMailCategory: "",
  updateClientMailCategory: "",
  getAllClientMailCategory: "",
  deleteClientMailCategory: "",
};

export const clientMailCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CLIENT_MAIL_CATEGORY:
      return { ...state, createClientMailCategory: action.payload };
    case UPDATE_CLIENT_MAIL_CATEGORY:
      return { ...state, updateClientMailCategory: action.payload };
    case GET_ALL_CLIENT_MAIL_CATEGORY:
      return { ...state, getAllClientMailCategory: action.payload };
    case DELETE_CLIENT_MAIL_CATEGORY:
      return { ...state, deleteClientMailCategory: action.payload };
    default:
      return state;
  }
};
