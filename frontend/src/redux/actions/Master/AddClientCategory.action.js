import Axios from "../../../api";
import {
  createClientMailCategoryUrl,
  deleteClientMailCategoryUrl,
  getAllClientMailCategoryUrl,
  updateClientMailCategoryUrl,
} from "../../routes/Master/AddClientCategory.route";

export const CREATE_CLIENT_MAIL_CATEGORY = "CREATE_CLIENT_MAIL_CATEGORY";
export const UPDATE_CLIENT_MAIL_CATEGORY = "UPDATE_CLIENT_MAIL_CATEGORY";
export const GET_ALL_CLIENT_MAIL_CATEGORY = "GET_ALL_CLIENT_MAIL_CATEGORY";
export const DELETE_CLIENT_MAIL_CATEGORY = "DELETE_CLIENT_MAIL_CATEGORY";

const createClientMailCategoryAction = (payload) => ({
  type: CREATE_CLIENT_MAIL_CATEGORY,
  payload,
});

const updateClientMailCategoryAction = (payload) => ({
  type: UPDATE_CLIENT_MAIL_CATEGORY,
  payload,
});

const getAllClientMailCategoryAction = (payload) => ({
  type: GET_ALL_CLIENT_MAIL_CATEGORY,
  payload,
});

const deleteClientMailCategoryAction = (payload) => ({
  type: DELETE_CLIENT_MAIL_CATEGORY,
  payload,
});

export const createClientMailCategory = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createClientMailCategoryUrl, payload);
      dispatch(createClientMailCategoryAction(res.data));
      return res;
    } catch (error) {
      console.error("Error creating Client mail category:", error);
      throw error;
    }
  };
};

export const updateClientMailCategory = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateClientMailCategoryUrl}/${id}`, payload);
      dispatch(updateClientMailCategoryAction(res.data));
      return res;
    } catch (error) {
      console.error("Error updating Client mail category:", error);
      throw error;
    }
  };
};

export const getAllClientMailCategory = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllClientMailCategoryUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllClientMailCategoryAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching all Client mail categoryes:", error);
      throw error;
    }
  };
};

export const deleteClientMailCategory = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteClientMailCategoryUrl}/${id}`);
      dispatch(deleteClientMailCategoryAction(res.data));
      return res;
    } catch (error) {
      console.error("Error deleting Client mail category:", error);
      throw error;
    }
  };
};