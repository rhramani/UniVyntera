import Axios from "../../../../api.js";
import { createTypeUrl, deleteTypeUrl, getAllTypeUrl, getTypeUrl, updateTypeUrl } from "../../../routes/Master/TaskManagement/TaskType.route.js";

export const CREATE_TYPE = "CREATE_TYPE";
export const UPDATE_TYPE = "UPDATE_TYPE";
export const GET_ALL_TYPE = "GET_ALL_TYPE";
export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const GET_TYPE = "GET_TYPE";

const createTypeAction = (payload) => ({ type: CREATE_TYPE, payload });
const updateTypeAction = (payload) => ({ type: UPDATE_TYPE, payload });
const getAllTypeAction = (payload) => ({ type: GET_ALL_TYPE, payload });
const deleteTypeAction = (payload) => ({ type: DELETE_CATEGORY, payload });
const getTypeAction = (payload) => ({ type: GET_TYPE, payload });

export const createType = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createTypeUrl, payload);
      dispatch(createTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create Type", error);
      throw error;
    }
  };
};

export const updateType = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateTypeUrl}/${id}`, payload);
      dispatch(updateTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update Type", error);
      throw error;
    }
  };
};


export const getAllType  = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllTypeUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Type", error);
      throw error;
    }
  };
};


export const deleteType = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteTypeUrl}/${id}`);
      dispatch(deleteTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete Type", error);
      throw error;
    }
  };
};

export const getType= (country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getTypeUrl}?country=${country}`);
      dispatch(getTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get Type", error);
      throw error;
    }
  };
}