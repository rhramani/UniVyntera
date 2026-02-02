import Axios from "../../api.js";
import { createPromotionalPptUrl, createSubPromotionalPptUrl, deletePromotionalPptUrl, getAllPromotionalPptUrl, getOnePromotionalPptUrl, updatePromotionalPptUrl } from "../routes/PromotionalPpt.route.js";

export const CREATE_PROMOTIONAL_PPT = "CREATE_PROMOTIONAL_PPT";
export const UPDATE_PROMOTIONAL_PPT = "UPDATE_PROMOTIONAL_PPT";
export const GET_ALL_PROMOTIONAL_PPT = "GET_ALL_PROMOTIONAL_PPT";
export const DELETE_PROMOTIONAL_PPT = "DELETE_PROMOTIONAL_PPT";
export const GET_ONE_PROMOTIONAL_PPT = "GET_ONE_PROMOTIONAL_PPT";
export const CREATE_SUB_PROMOTIONAL_PPT = "CREATE_SUB_PROMOTIONAL_PPT";

const createPromotionalPptAction = (payload) => ({
  type: CREATE_PROMOTIONAL_PPT,
  payload,
});
const updatePromotionalPptAction = (payload) => ({
  type: UPDATE_PROMOTIONAL_PPT,
  payload,
});
const getAllPromotionalPptAction = (payload) => ({
  type: GET_ALL_PROMOTIONAL_PPT,
  payload,
});
const deletePromotionalPptAction = (payload) => ({
  type: DELETE_PROMOTIONAL_PPT,
  payload,
});
const getOnePromotionalPptAction = (payload) => ({
  type: GET_ONE_PROMOTIONAL_PPT,
  payload,
});
const createSubPromotionalPptAction = (payload) => ({
  type: CREATE_SUB_PROMOTIONAL_PPT,
  payload,
});

export const createPromotionalPpt = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createPromotionalPptUrl}`, payload);
      dispatch(createPromotionalPptAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updatePromotionalPpt = (id, docId, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updatePromotionalPptUrl}?id=${id}&docId=${docId}`, payload);
      dispatch(updatePromotionalPptAction(res));
      return res;
    } catch (error) {
      console.log("Error in updatePromotionalPpt:", error.response?.data || error);
      throw error;
    }
  };
};

export const getAllPromotionalPpt = (
  page = 1,
  limit,
  search = "",
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllPromotionalPptUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllPromotionalPptAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOnePromotionalPpt = (id, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOnePromotionalPptUrl}/${id}?&search=${search}`);
      dispatch(getOnePromotionalPptAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deletePromotionalPpt = (id, docId) => {
  return async (dispatch) => {
    try {
      let res;
      if (docId === "") {
        res = await Axios.delete(`${deletePromotionalPptUrl}/${id}`);

      } else {

        res = await Axios.delete(`${deletePromotionalPptUrl}/${id}/${docId}`);
      }
      dispatch(deletePromotionalPptAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
export const createSubPromotionalPpt = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.patch(`${createSubPromotionalPptUrl}/${id}`, payload);
      dispatch(createSubPromotionalPptAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
