import Axios from "../../../api";
import { createSubjectUrl, deleteSubjectUrl, getAllSubjectUrl, updateSubjectUrl } from "../../routes/Master/CoachingSubject.route";

export const CREATE_SUBJECT = "CREATE_SUBJECT";
export const UPDATE_SUBJECT = "UPDATE_SUBJECT";
export const GET_ALL_SUBJECT = "GET_ALL_SUBJECT";
export const DELETE_SUBJECT = "DELETE_SUBJECT";

const createSubjectAction = (payload) => {
    return {
        type: CREATE_SUBJECT,
        payload: payload,
    };
};

const updateSubjectAction = (payload) => {
    return {
        type: UPDATE_SUBJECT,
        payload: payload,
    };
};

const getAllSubjectAction = (payload) => {
    return {
        type: GET_ALL_SUBJECT,
        payload: payload,
    };
};

const deleteSubjectAction = (payload) => {
    return {
        type: DELETE_SUBJECT,
        payload: payload,
    };
};

export const createSubject = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createSubjectUrl, payload);
      dispatch(createSubjectAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create Subject", error);
      throw error;
    }
  };
};

export const updateSubject = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateSubjectUrl}/${id}`, payload);
      dispatch(updateSubjectAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update Subject", error);
      throw error;
    }
  };
};


export const getAllSubject = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllSubjectUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllSubjectAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Subject", error);
      throw error;
    }
  };
};


export const deleteSubjects = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteSubjectUrl}/${id}`);
      dispatch(deleteSubjectAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete Subject", error);
      throw error;
    }
  };
};
