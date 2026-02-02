import Axios from "../../../../api.js";
import {
  createTaskStatusUrl,
  deleteTaskStatusUrl,
  getAllTaskStatusUrl,
  getOneTaskStatusUrl,
  updateTaskStatusUrl,
} from "../../../routes/Master/TaskManagement/TaskStatus.route.js"; 

export const CREATE_TASK_STATUS = "CREATE_TASK_STATUS";
export const UPDATE_TASK_STATUS = "UPDATE_TASK_STATUS";
export const GET_ONE_TASK_STATUS = "GET_ONE_TASK_STATUS";
export const GET_ALL_TASK_STATUS = "GET_ALL_TASK_STATUS";
export const DELETE_TASK_STATUS = "DELETE_TASK_STATUS";

const createTaskStatusAction = (payload) => ({
  type: CREATE_TASK_STATUS,
  payload,
});

const updateTaskStatusAction = (payload) => ({
  type: UPDATE_TASK_STATUS,
  payload,
});

const getOneTaskStatusAction = (payload) => ({
  type: GET_ONE_TASK_STATUS,
  payload,
});

const getAllTaskStatusAction = (payload) => ({
  type: GET_ALL_TASK_STATUS,
  payload,
});

const deleteTaskStatusAction = (payload) => ({
  type: DELETE_TASK_STATUS,
  payload,
});

export const createTaskStatus = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createTaskStatusUrl, payload);
      dispatch(createTaskStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error in create task status:", error);
      throw error;
    }
  };
};

export const updateTaskStatus = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateTaskStatusUrl}/${id}`, payload);
      dispatch(updateTaskStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error in update task status:", error);
      throw error;
    }
  };
};

export const getOneTaskStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneTaskStatusUrl}/${id}`);
      dispatch(getOneTaskStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error in get one task status:", error);
      throw error;
    }
  };
};

export const getAllTaskStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllTaskStatusUrl}?search=${search}`);
      dispatch(getAllTaskStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error in get all task status:", error);
      throw error;
    }
  };
};

export const deleteTaskStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteTaskStatusUrl}/${id}`);
      dispatch(deleteTaskStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error in delete task status:", error);
      throw error;
    }
  };
};