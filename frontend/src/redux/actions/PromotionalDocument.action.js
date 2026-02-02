import Axios from "../../api.js";
import {
  promotionalAddSubDocUrl,
  promotionalDocCreateUrl,
  promotionalDocDeleteUrl,
  promotionalDocFolderUrl,
  promotionalDocGetAllUrl,
  promotionalDocGetOneUrl,
  promotionalDocUpdateUrl,
} from "../routes/PromotionalDocument.route";

export const CREATE_PROMOTIONAL_DOCUMENT = "CREATE_PROMOTIONAL_DOCUMENT";
export const UPDATE_PROMOTIONAL_DOCUMENT = "UPDATE_PROMOTIONAL_DOCUMENT";
export const GET_ALL_PROMOTIONAL_DOCUMENT = "GET_ALL_PROMOTIONAL_DOCUMENT";
export const DELETE_PROMOTIONAL_DOCUMENT = "DELETE_PROMOTIONAL_DOCUMENT";
export const GET_ONE_PROMOTIONAL_DOCUMENT = "GET_ONE_PROMOTIONAL_DOCUMENT";
export const CREATE_SUB_PROMOTIONAL_DOCUMENT =
  "CREATE_SUB_PROMOTIONAL_DOCUMENT";
export const CREATE_FOLDER_ACTION = "CREATE_FOLDER_ACTION";

const createPromotionalDocAction = (payload) => ({
  type: CREATE_PROMOTIONAL_DOCUMENT,
  payload,
});
const updatePromotionalDocAction = (payload) => ({
  type: UPDATE_PROMOTIONAL_DOCUMENT,
  payload,
});
const getAllPromotionalDocAction = (payload) => ({
  type: GET_ALL_PROMOTIONAL_DOCUMENT,
  payload,
});
const deletePromotionalDocAction = (payload) => ({
  type: DELETE_PROMOTIONAL_DOCUMENT,
  payload,
});
const getOnePromotionalDocAction = (payload) => ({
  type: GET_ONE_PROMOTIONAL_DOCUMENT,
  payload,
});
const createSubPromotionalDocAction = (payload) => ({
  type: CREATE_SUB_PROMOTIONAL_DOCUMENT,
  payload,
});
const createFolderAction = (payload) => ({
  type: CREATE_FOLDER_ACTION,
  payload,
});

export const createPromotionalDoc = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${promotionalDocCreateUrl}`, payload);
      dispatch(createPromotionalDocAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updatePromotionalDoc = (id, docId, materialId, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(
        `${promotionalDocUpdateUrl}?id=${id}&docId=${docId}&materialId=${materialId}`,
        payload
      );
      dispatch(updatePromotionalDocAction(res));
      return res;
    } catch (error) {
      console.log(
        "Error in updatePromotionalDoc:",
        error.response?.data || error
      );
      throw error;
    }
  };
};

export const getAllPromotionalDoc = (page = 1, limit, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${promotionalDocGetAllUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllPromotionalDocAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOnePromotionalDoc = (id, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${promotionalDocGetOneUrl}/${id}?&search=${search}`
      );
      dispatch(getOnePromotionalDocAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deletePromotionalDoc = (id, docId, fileId) => {
  return async (dispatch) => {
    try {
      let res;
      if (docId === "" && fileId === "") {
        res = await Axios.delete(`${promotionalDocDeleteUrl}/${id}`);
      } else if (fileId === "") {
        res = await Axios.delete(`${promotionalDocDeleteUrl}/${id}/${docId}`);
      } else {
        res = await Axios.delete(
          `${promotionalDocDeleteUrl}/${id}/${docId}/${fileId}`
        );
      }
      dispatch(deletePromotionalDocAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const createSubPromotionalDoc = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.patch(
        `${promotionalAddSubDocUrl}/${id}`,
        payload
      );
      dispatch(createSubPromotionalDocAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const createFolder = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.patch(`${promotionalDocFolderUrl}/${id}`, payload);
      dispatch(createFolderAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
