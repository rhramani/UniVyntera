import Axios from "../../api.js";
import { createSocialMediaPromotionUrl, createSubSocialMediaPromotionUrl, deleteSocialMediaPromotionUrl, getAllSocialMediaPromotionUrl, getOneSocialMediaPromotionUrl, updateSocialMediaPromotionUrl } from "../routes/SocialMediaPromotion.route";

export const CREATE_SOCIAL_MEDIA_PROMOTION = "CREATE_SOCIAL_MEDIA_PROMOTION";
export const UPDATE_SOCIAL_MEDIA_PROMOTION = "UPDATE_SOCIAL_MEDIA_PROMOTION";
export const GET_ALL_SOCIAL_MEDIA_PROMOTION = "GET_ALL_SOCIAL_MEDIA_PROMOTION";
export const DELETE_SOCIAL_MEDIA_PROMOTION = "DELETE_SOCIAL_MEDIA_PROMOTION";
export const GET_ONE_SOCIAL_MEDIA_PROMOTION = "GET_ONE_SOCIAL_MEDIA_PROMOTION";
export const CREATE_SUB_SOCIAL_MEDIA_PROMOTION = "CREATE_SUB_SOCIAL_MEDIA_PROMOTION";

const createSocialMediaPromotionAction = (payload) => ({
  type: CREATE_SOCIAL_MEDIA_PROMOTION,
  payload,
});
const updateSocialMediaPromotionAction = (payload) => ({
  type: UPDATE_SOCIAL_MEDIA_PROMOTION,
  payload,
});
const getAllSocialMediaPromotionAction = (payload) => ({
  type: GET_ALL_SOCIAL_MEDIA_PROMOTION,
  payload,
});
const deleteSocialMediaPromotionAction = (payload) => ({
  type: DELETE_SOCIAL_MEDIA_PROMOTION,
  payload,
});
const getOneSocialMediaPromotionAction = (payload) => ({
  type: GET_ONE_SOCIAL_MEDIA_PROMOTION,
  payload,
});
const createSubSocialMediaPromotionAction = (payload) => ({
  type: CREATE_SUB_SOCIAL_MEDIA_PROMOTION,
  payload,
});

export const createSocialMediaPromotion = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createSocialMediaPromotionUrl}`, payload);
      dispatch(createSocialMediaPromotionAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateSocialMediaPromotion = (id, docId, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateSocialMediaPromotionUrl}?id=${id}&docId=${docId}`, payload);
      dispatch(updateSocialMediaPromotionAction(res));
      return res;
    } catch (error) {
      console.log("Error in updateSocialMediaPromotion:", error.response?.data || error);
      throw error;
    }
  };
};

export const getAllSocialMediaPromotion = (
  page = 1,
  limit,
  search = "",
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllSocialMediaPromotionUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllSocialMediaPromotionAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOneSocialMediaPromotion = (id, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneSocialMediaPromotionUrl}/${id}?&search=${search}`);
      dispatch(getOneSocialMediaPromotionAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteSocialMediaPromotion = (id, docId) => {
  return async (dispatch) => {
    try {
      let res;
      if (docId === "") {
        res = await Axios.delete(`${deleteSocialMediaPromotionUrl}/${id}`);

      } else {

        res = await Axios.delete(`${deleteSocialMediaPromotionUrl}/${id}/${docId}`);
      }
      dispatch(deleteSocialMediaPromotionAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
export const createSubSocialMediaPromotion = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.patch(`${createSubSocialMediaPromotionUrl}/${id}`, payload);
      dispatch(createSubSocialMediaPromotionAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
