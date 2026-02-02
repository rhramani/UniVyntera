import Axios from "../../../../api.js";
import {
  createPriorityUrl,
  deletePriorityUrl,
  getAllPriorityUrl,
  getPriorityUrl,
  updatePriorityUrl,
} from "../../../routes/Master/TaskManagement/TaskPriority.route.js";

export const CREATE_PRIORITY = "CREATE_PRIORITY";
export const UPDATE_PRIORITY = "UPDATE_PRIORITY";
export const GET_ALL_PRIORITY = "GET_ALL_PRIORITY";
export const DELETE_PRIORITY = "DELETE_PRIORITY";
export const GET_PRIORITY = "GET_PRIORITY";

const createPriorityAction = (payload) => ({ type: CREATE_PRIORITY, payload });
const updatePriorityAction = (payload) => ({ type: UPDATE_PRIORITY, payload });
const getAllPriorityAction = (payload) => ({ type: GET_ALL_PRIORITY, payload });
const deletePriorityAction = (payload) => ({ type: DELETE_PRIORITY, payload });
const getPriorityAction = (payload) => ({ type: GET_PRIORITY, payload });

export const createPriority = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createPriorityUrl, payload);
      dispatch(createPriorityAction(res.data));
      return res;
    } catch (error) {
      console.log("Error in create Priority", error);
      throw error;
    }
  };
};

export const updatePriority = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updatePriorityUrl}/${id}`, payload);
      dispatch(updatePriorityAction(res.data));
      return res;
    } catch (error) {
      console.log("Error in update Priority", error);
      throw error;
    }
  };
};

export const getAllPriority = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllPriorityUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllPriorityAction(res.data));
      return res;
    } catch (error) {
      console.log("Error in get all Priority", error);
      throw error;
    }
  };
};

export const deletePriority = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deletePriorityUrl}/${id}`);
      dispatch(deletePriorityAction(res.data));
      return res;
    } catch (error) {
      console.log("Error in delete Priority", error);
      throw error;
    }
  };
};

export const getPriority = (country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getPriorityUrl}?country=${country}`);
      dispatch(getPriorityAction(res.data));
      return res;
    } catch (error) {
      console.log("Error in get Priority", error);
      throw error;
    }
  };
};