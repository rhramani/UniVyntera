import Axios from "../../../api.js";
import {
  createStudentStatusUrl,
  deleteStudentStatusUrl,
  getAllStudentStatusUrl,
  getOneStudentStatusUrl,
  updateStudentStatusUrl,
} from "../../routes/Student/StudentStatus.route.js";

export const CREATE_STUDENT_STATUS = "CREATE_STUDENT_STATUS";
export const UPDATE_STUDENT_STATUS = "UPDATE_STUDENT_STATUS";
export const GET_ONE_STUDENT_STATUS = "GET_ONE_STUDENT_STATUS";
export const GET_ALL_STUDENT_STATUS = "GET_ALL_STUDENT_STATUS";
export const DELETE_STUDENT_STATUS = "DELETE_STUDENT_STATUS";

const createStudentStatusAction = (payload) => ({
  type: CREATE_STUDENT_STATUS,
  payload,
});

const updateStudentStatusAction = (payload) => ({
  type: UPDATE_STUDENT_STATUS,
  payload,
});

const getOneStudentStatusAction = (payload) => ({
  type: GET_ONE_STUDENT_STATUS,
  payload,
});

const getAllStudentStatusAction = (payload) => ({
  type: GET_ALL_STUDENT_STATUS,
  payload,
});

const deleteStudentStatusAction = (payload) => ({
  type: DELETE_STUDENT_STATUS,
  payload,
});

export const createStudentStatus = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createStudentStatusUrl, payload);
      dispatch(createStudentStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create status:", error);
      throw error;
    }
  };
};

export const updateStudentStatus = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateStudentStatusUrl}/${id}`, payload);
      dispatch(updateStudentStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update status:", error);
      throw error;
    }
  };
};

export const getOneStudentStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneStudentStatusUrl}/${id}`);
      dispatch(getOneStudentStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getOne status:", error);
      throw error;
    }
  };
};

export const getAllStudentStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllStudentStatusUrl}?search=${search}`);
      dispatch(getAllStudentStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll status:", error);
      throw error;
    }
  };
};

export const deleteStudentStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteStudentStatusUrl}/${id}`);
      dispatch(deleteStudentStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete Inquiry:", error);
      throw error;
    }
  };
};
