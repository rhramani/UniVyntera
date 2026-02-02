import Axios from "../../../api.js";
import { createStudentRegisterForUrl, deleteStudentRegisterForUrl, getAllStudentRegisterForUrl, updateStudentRegisterForUrl } from "../../routes/Master/StudentRegisterFor.action.js";

export const CREATE_STUDENT_RAGISTER_FOR = "CREATE_STUDENT_RAGISTER_FOR";
export const UPDATE_STUDENT_RAGISTER_FOR = "UPDATE_STUDENT_RAGISTER_FOR";
export const GETALL_STUDENT_RAGISTER_FOR = "GETALL_STUDENT_RAGISTER_FOR";
export const DELETE_STUDENT_RAGISTER_FOR = "DELETE_STUDENT_RAGISTER_FOR";

const createStudentRegisterForAction = (payload) => ({ type: CREATE_STUDENT_RAGISTER_FOR, payload });
const updateStudentRegisterForAction = (payload) => ({ type: UPDATE_STUDENT_RAGISTER_FOR, payload });
const getAllStudentRegisterForAction = (payload) => ({ type: GETALL_STUDENT_RAGISTER_FOR, payload });
const deleteStudentRegisterForAction = (payload) => ({ type: DELETE_STUDENT_RAGISTER_FOR, payload });

export const createStudentRegisterFor = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createStudentRegisterForUrl, payload);
      dispatch(createStudentRegisterForAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create student register for");
      throw error;
    }
  };
};

export const updateStudentRegisterFor = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateStudentRegisterForUrl}/${id}`, payload);
      dispatch(updateStudentRegisterForAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update student register for");
      throw error;
    }
  };
};

export const getAllStudentRegisterFor = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllStudentRegisterForUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllStudentRegisterForAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll student register for");
      throw error;
    }
  };
};

export const deleteStudentRegisterFor = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteStudentRegisterForUrl}/${id}`);
      dispatch(deleteStudentRegisterForAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete student register for");
      throw error;
    }
  };
};
