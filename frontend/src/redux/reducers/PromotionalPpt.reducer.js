import { CREATE_PROMOTIONAL_PPT, CREATE_SUB_PROMOTIONAL_PPT, DELETE_PROMOTIONAL_PPT, GET_ALL_PROMOTIONAL_PPT, GET_ONE_PROMOTIONAL_PPT, UPDATE_PROMOTIONAL_PPT } from "../actions/PromotionalPpt.action";


const initialState = {
  createPromotionalPpt: "",
  updatePromotionalPpt: "",
  getAllPromotionalPpt: "",
  deletePromotionalPpt: "",
  getOnePromotionalPpt: "",
  createSubPromotionalPpt: "",
};

export const promotionalPptReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PROMOTIONAL_PPT:
      return { ...state, createPromotionalPpt: action.payload };
    case UPDATE_PROMOTIONAL_PPT:
      return { ...state, updatePromotionalPpt: action.payload };
    case GET_ALL_PROMOTIONAL_PPT:
      return { ...state, getAllPromotionalPpt: action.payload };
    case DELETE_PROMOTIONAL_PPT:
      return { ...state, deletePromotionalPpt: action.payload };
    case GET_ONE_PROMOTIONAL_PPT:
      return { ...state, getOnePromotionalPpt: action.payload };
    case CREATE_SUB_PROMOTIONAL_PPT:
      return { ...state, createSubPromotionalPpt: action.payload };
    default:
      return state;
  }
};
