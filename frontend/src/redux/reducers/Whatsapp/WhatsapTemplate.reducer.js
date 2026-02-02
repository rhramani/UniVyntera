import { CREATE_WP_TEMPLATE, DELETE_WP_TEMPLATE, GET_ALL_WP_TEMPLATE, GET_ONE_WP_TEMPLATE, UPDATE_WP_TEMPLATE } from "../../actions/Whatsapp/WhatsappTemplate.action";

const initialState = {
  createTemplate: "",
  updateTemplate: "",
  getOneTemplate: "",
  getAllTemplate: "",
  deleteTemplate: "",
};

export const WhatsappTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_WP_TEMPLATE:
      return { ...state, createTemplate: action.payload };
    case UPDATE_WP_TEMPLATE:
      return { ...state, updateTemplate: action.payload };
    case GET_ONE_WP_TEMPLATE:
      return { ...state, getOneTemplate: action.payload };
    case GET_ALL_WP_TEMPLATE:
      return { ...state, getAllTemplate: action.payload };
    case DELETE_WP_TEMPLATE:
      return { ...state, deleteTemplate: action.payload };
    default:
      return state;
  }
}