import {
  CREATE_PROMOTIONAL_TUTORIAL,
  CREATE_SUB_PROMOTIONAL_TUTORIAL,
  DELETE_PROMOTIONAL_TUTORIAL,
  GET_ALL_PROMOTIONAL_TUTORIAL,
  GET_ONE_PROMOTIONAL_TUTORIAL,
  UPDATE_PROMOTIONAL_TUTORIAL,
} from "../actions/promotionalTutorial.action";

const initialState = {
  createPromotionalTutorial: "",
  updatePromotionalTutorial: "",
  getAllPromotionalTutorial: "",
  deletePromotionalTutorial: "",
  getOnePromotionalTutorial: "",
  createSubPromotionalTutorial: "",
};

export const PromotionalTutorialReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PROMOTIONAL_TUTORIAL:
      return { ...state, createPromotionalTutorial: action.payload };
    case UPDATE_PROMOTIONAL_TUTORIAL:
      return { ...state, updatePromotionalTutorial: action.payload };
    case GET_ALL_PROMOTIONAL_TUTORIAL:
      return { ...state, getAllPromotionalTutorial: action.payload };
    case DELETE_PROMOTIONAL_TUTORIAL:
      return { ...state, deletePromotionalTutorial: action.payload };
    case GET_ONE_PROMOTIONAL_TUTORIAL:
      return { ...state, getOnePromotionalTutorial: action.payload };
    case CREATE_SUB_PROMOTIONAL_TUTORIAL:
      return { ...state, createSubPromotionalTutorial: action.payload };
    default:
      return state;
  }
};
