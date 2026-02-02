import {
  CREATE_SOCIAL_MEDIA_PROMOTION,
  CREATE_SUB_SOCIAL_MEDIA_PROMOTION,
  DELETE_SOCIAL_MEDIA_PROMOTION,
  GET_ALL_SOCIAL_MEDIA_PROMOTION,
  GET_ONE_SOCIAL_MEDIA_PROMOTION,
  UPDATE_SOCIAL_MEDIA_PROMOTION,
} from "../actions/SocialMediaPromotion.action";

const initialState = {
  createSocialMediaPromotion: "",
  updateSocialMediaPromotion: "",
  getAllSocialMediaPromotion: "",
  deleteSocialMediaPromotion: "",
  getOneSocialMediaPromotion: "",
  createSubSocialMediaPromotion: "",
};

export const socialMediaPromotionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SOCIAL_MEDIA_PROMOTION:
      return { ...state, createSocialMediaPromotion: action.payload };
    case UPDATE_SOCIAL_MEDIA_PROMOTION:
      return { ...state, updateSocialMediaPromotion: action.payload };
    case GET_ALL_SOCIAL_MEDIA_PROMOTION:
      return { ...state, getAllSocialMediaPromotion: action.payload };
    case DELETE_SOCIAL_MEDIA_PROMOTION:
      return { ...state, deleteSocialMediaPromotion: action.payload };
    case GET_ONE_SOCIAL_MEDIA_PROMOTION:
      return { ...state, getOneSocialMediaPromotion: action.payload };
    case CREATE_SUB_SOCIAL_MEDIA_PROMOTION:
      return { ...state, createSubSocialMediaPromotion: action.payload };
    default:
      return state;
  }
};
