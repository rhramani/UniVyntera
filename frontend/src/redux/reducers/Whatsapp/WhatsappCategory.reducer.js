import { CREATE_WP_CATEGORY, DELETE_WP_CATEGORY, GET_ALL_WP_CATEGORY, GET_ONE_WP_CATEGORY, UPDATE_WP_CATEGORY } from "../../actions/Whatsapp/WhatsappCategory.action";

const initialState = {
  createCategory: "",
  updateCategory: "",
  getOneCategory: "",
  getAllCategory: "",
  deleteCategory: "",
};

export const WhatsappCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_WP_CATEGORY:
      return { ...state, createCategory: action.payload };
    case UPDATE_WP_CATEGORY:
      return { ...state, updateCategory: action.payload };
    case GET_ONE_WP_CATEGORY:
      return { ...state, getOneCategory: action.payload };
    case GET_ALL_WP_CATEGORY:
      return { ...state, getAllCategory: action.payload };
    case DELETE_WP_CATEGORY:
      return { ...state, deleteCategory: action.payload };
    default:
      return state;
  }
}