import Axios from "../../api.js";
import {
  promotionalTutorialCreateUrl,
  promotionalTutorialDeleteUrl,
  promotionalTutorialGetAllUrl,
  promotionalTutorialUpdateUrl,
  promotionalTutorialGetOneUrl,
  promotionalTutorialCreateSubUrl,
} from "../routes/PromotionalTutorial.route";

export const CREATE_PROMOTIONAL_TUTORIAL = "CREATE_PROMOTIONAL_TUTORIAL";
export const UPDATE_PROMOTIONAL_TUTORIAL = "UPDATE_PROMOTIONAL_TUTORIAL";
export const GET_ONE_PROMOTIONAL_TUTORIAL = "GET_ONE_PROMOTIONAL_TUTORIAL";
export const GET_ALL_PROMOTIONAL_TUTORIAL = "GET_ALL_PROMOTIONAL_TUTORIAL";
export const DELETE_PROMOTIONAL_TUTORIAL = "DELETE_PROMOTIONAL_TUTORIAL";
export const CREATE_SUB_PROMOTIONAL_TUTORIAL = "CREATE_SUB_PROMOTIONAL_TUTORIAL";

const createPromotionalTutorialAction = (payload) => ({
  type: CREATE_PROMOTIONAL_TUTORIAL,
  payload,
});
const updatePromotionalTutorialAction = (payload) => ({
  type: UPDATE_PROMOTIONAL_TUTORIAL,
  payload,
});
const getAllPromotionalTutorialAction = (payload) => ({
  type: GET_ALL_PROMOTIONAL_TUTORIAL,
  payload,
});
const deletePromotionalTutorialAction = (payload) => ({
  type: DELETE_PROMOTIONAL_TUTORIAL,
  payload,
});

const getOnePromotionalTutorialAction = (payload) => ({
  type: GET_ONE_PROMOTIONAL_TUTORIAL,
  payload,
});
const createSubPromotionalTutorialAction = (payload) => ({
  type: CREATE_SUB_PROMOTIONAL_TUTORIAL,
  payload,
});

export const createPromotionalTutorial = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${promotionalTutorialCreateUrl}`, payload);
      dispatch(createPromotionalTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updatePromotionalTutorial = (id, videoId, fileId, payload) => {
  return async (dispatch) => {
    try {
      let res;
      if (videoId === "" && fileId === "") {
        res = await Axios.put(`${promotionalTutorialUpdateUrl}/${id}`,payload);
      } else  {
        res = await Axios.put(`${promotionalTutorialUpdateUrl}/${id}/${videoId}/${fileId}`,payload);
      }
      dispatch(updatePromotionalTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllPromotionalTutorial = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${promotionalTutorialGetAllUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllPromotionalTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deletePromotionalTutorial = (id, videoId) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(
        `${promotionalTutorialDeleteUrl}/${id}/${videoId}`
      );
      dispatch(deletePromotionalTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOnePromotionalTutorial = (id, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${promotionalTutorialGetOneUrl}/${id}?&search=${search}`);
      dispatch(getOnePromotionalTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
}
export const createSubPromotionalTutorial = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.patch(`${promotionalTutorialCreateSubUrl}/${id}`, payload);
      dispatch(createSubPromotionalTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
}