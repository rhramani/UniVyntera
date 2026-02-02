import Axios from "../../../api.js";
import {
  createCourseUrl,
  deleteCourseUrl,
  getAllCourseUrl,
  updateCourseUrl,
} from "../../routes/Master/Course.routes";

export const CREATE_COURSE = "CREATE_COURSE";
export const UPDATE_COURSE = "UPDATE_COURSE";
export const GET_ALL_COURSE = "GET_ALL_COURSE";
export const DELETE_COURSE = "DELETE_COURSE";

const createCourseAction = (payload) => ({ type: CREATE_COURSE, payload });
const updateCourseAction = (payload) => ({ type: UPDATE_COURSE, payload });
const getAllCourseAction = (payload) => ({ type: GET_ALL_COURSE, payload });
const deleteCourseAction = (payload) => ({ type: DELETE_COURSE, payload });

export const createCourse = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createCourseUrl, payload);
      dispatch(createCourseAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create course", error);
      throw error;
    }
  };
};

export const updateCourse = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCourseUrl}/${id}`, payload);
      dispatch(updateCourseAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update course", error);
      throw error;
    }
  };
};

export const getAllCourse = (page = 1, limit = 10) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllCourseUrl}?page=${page}&limit=${limit}`);
      dispatch(getAllCourseAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all course", error);
      throw error;
    }
  };
};

export const deleteCourse = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCourseUrl}/${id}`);
      dispatch(deleteCourseAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete course", error);
      throw error;
    }
  };
};
