import Axios from "../../../api.js";
import {
  createTaskDetailsUrl,
  deleteTaskDetailsUrl,
  getAllTaskDetailsUrl,
  getOneTaskDetailsUrl,
  updateTaskDetailsUrl,
} from "../../routes/TaskManagement/TaskDetails.route.js";

export const CREATE_TASK_DETAILS = "CREATE_TASK_DETAILS";
export const UPDATE_TASK_DETAILS = "UPDATE_TASK_DETAILS";
export const GET_ALL_TASK_DETAILS = "GET_ALL_TASK_DETAILS";
export const DELETE_TASK_DETAILS = "DELETE_TASK_DETAILS";
export const GET_TASK_DETAILS = "GET_TASK_DETAILS";

const createTaskDetailsAction = (payload) => ({
  type: CREATE_TASK_DETAILS,
  payload,
});
const updateTaskDetailsAction = (payload) => ({
  type: UPDATE_TASK_DETAILS,
  payload,
});
const getAllTaskDetailsAction = (payload) => ({
  type: GET_ALL_TASK_DETAILS,
  payload,
});
const deleteTaskDetailsAction = (payload) => ({
  type: DELETE_TASK_DETAILS,
  payload,
});
const getTaskDetailsAction = (payload) => ({ type: GET_TASK_DETAILS, payload });
export const createTaskDetails = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createTaskDetailsUrl, payload);
      dispatch(createTaskDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create task details", error);
      throw error;
    }
  };
};

export const updateTaskDetails = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateTaskDetailsUrl}/${id}`, payload);
      dispatch(updateTaskDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update task details", error);
      throw error;
    }
  };
};

export const getTaskDetails = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneTaskDetailsUrl}/${id}`);
      dispatch(getTaskDetailsAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getOne task details", error);
      throw error;
    }
  };
};

export const getAllTaskDetails = (
  page = 1,
  limit = 10,
  search = "",
  showAll = false,
  branchId = "",
  role = "",
  user = "",
  status = null,
  category = null,
  priority = null,
  type = null
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllTaskDetailsUrl}?page=${page}&limit=${limit}&search=${search}&showAll=${showAll}&branchId=${branchId}&role=${role}&user=${user}&status=${status}&category=${category}&priority=${priority}&type=${type}`
      );
      dispatch(getAllTaskDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all task details", error);
      throw error;
    }
  };
};

export const deleteTaskDetails = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteTaskDetailsUrl}/${id}`);
      dispatch(deleteTaskDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete task details", error);
      throw error;
    }
  };
};
