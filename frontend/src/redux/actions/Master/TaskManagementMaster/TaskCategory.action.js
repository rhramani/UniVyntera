import Axios from "../../../../api.js";
import { createCategoryUrl, deleteCategoryUrl, getAllCategoryUrl, getCategoryUrl, updateCategoryUrl } from "../../../routes/Master/TaskManagement/TaskCategory.route.js";

export const CREATE_CATEGORY = "CREATE_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const GET_ALL_CATEGORY = "GET_ALL_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const GET_CATEGORY = "GET_CATEGORY";

const createCategoryAction = (payload) => ({ type: CREATE_CATEGORY, payload });
const updateCategoryAction = (payload) => ({ type: UPDATE_CATEGORY, payload });
const getAllCategoryAction = (payload) => ({ type: GET_ALL_CATEGORY, payload });
const deleteCategoryAction = (payload) => ({ type: DELETE_CATEGORY, payload });
const getCategoryAction = (payload) => ({ type: GET_CATEGORY, payload });

export const createCategory = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createCategoryUrl, payload);
      dispatch(createCategoryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create Category", error);
      throw error;
    }
  };
};

export const updateCategory = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCategoryUrl}/${id}`, payload);
      dispatch(updateCategoryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update Category", error);
      throw error;
    }
  };
};


export const getAllCategory = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllCategoryUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllCategoryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Category", error);
      throw error;
    }
  };
};


export const deleteCategory = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCategoryUrl}/${id}`);
      dispatch(deleteCategoryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete Category", error);
      throw error;
    }
  };
};

export const getCategory = (country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getCategoryUrl}?country=${country}`);
      dispatch(getCategoryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get Category", error);
      throw error;
    }
  };
}