import Axios from "../../../api.js";
import {
  createCoachingFacultyUrl,
  deleteCoachingFacultyUrl,
  getAllBatchTimesUrl,
  getAllCoachingFacultyUrl,
  getOneCoachingFacultyUrl,
  updateCoachingFacultyUrl,
} from "../../routes/Master/CoachingFaculty.route.js";

export const CREATE_COACHING_FACULTY = "CREATE_COACHING_FACULTY";
export const UPDATE_COACHING_FACULTY = "UPDATE_COACHING_FACULTY";
export const GETONE_COACHING_FACULTY = "GETONE_COACHING_FACULTY";
export const GETALL_COACHING_FACULTY = "GETALL_COACHING_FACULTY";
export const DELETE_COACHING_FACULTY = "DELETE_COACHING_FACULTY";
export const GET_ALL_BATCH_TIMES = "GET_ALL_BATCH_TIMES";

const createCoachingFacultyAction = (payload) => ({
  type: CREATE_COACHING_FACULTY,
  payload,
});
const updateCoachingFacultyAction = (payload) => ({
  type: UPDATE_COACHING_FACULTY,
  payload,
});
const getOneCoachingFacultyAction = (payload) => ({
  type: GETONE_COACHING_FACULTY,
  payload,
});
const getAllCoachingFacultyAction = (payload) => ({
  type: GETALL_COACHING_FACULTY,
  payload,
});
const deleteCoachingFacultyAction = (payload) => ({
  type: DELETE_COACHING_FACULTY,
  payload,
});
const getAllBatchTimesAction = (payload) => ({
  type: GET_ALL_BATCH_TIMES,
  payload,
});

export const createCoachingFaculty = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createCoachingFacultyUrl, payload);
      dispatch(createCoachingFacultyAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create coaching faculty");
      throw error;
    }
  };
};

export const updateCoachingFaculty = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCoachingFacultyUrl}/${id}`, payload);
      dispatch(updateCoachingFacultyAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update coaching faculty");
      throw error;
    }
  };
};

export const getOneCoachingFaculty = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneCoachingFacultyUrl}/${id}`);
      dispatch(getOneCoachingFacultyAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll coaching faculty");
      throw error;
    }
  };
};

export const getAllCoachingFaculty = (
  page = 1,
  limit = 10,
  search = "",
  batchStatus = "",
  showAll = false,
  branchId = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllCoachingFacultyUrl}?page=${page}&limit=${limit}&search=${search}&batchStatus=${batchStatus}&showAll=${showAll}&branchId=${branchId}`
      );
      dispatch(getAllCoachingFacultyAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll coaching faculty");
      throw error;
    }
  };
};

export const deleteCoachingFaculty = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCoachingFacultyUrl}/${id}`);
      dispatch(deleteCoachingFacultyAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete coaching faculty");
      throw error;
    }
  };
};

export const getAllBatchTimes = (id, status) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllBatchTimesUrl}?id=${id}&status=${status}`);
      dispatch(getAllBatchTimesAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll batch times");
      throw error;
    }
  };
};
