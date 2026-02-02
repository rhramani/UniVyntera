import Axios from "../../../api.js";
import {
  createCampusUrl,
  deleteCampusUrl,
  getAllCampusUrl,
  getCampusUrl,
  updateCampusUrl,
} from "../../routes/Master/Campus.route";

export const CREATE_CAMPUS = "CREATE_CAMPUS";
export const UPDATE_CAMPUS = "UPDATE_CAMPUS";
export const GET_ALL_CAMPUS = "GET_ALL_CAMPUS";
export const DELETE_CAMPUS = "DELETE_CAMPUS";
export const GET_CAMPUS = "GET_CAMPUS";

const createCampusAction = (payload) => ({ type: CREATE_CAMPUS, payload });
const updateCampusAction = (payload) => ({ type: UPDATE_CAMPUS, payload });
const getAllCampusAction = (payload) => ({ type: GET_ALL_CAMPUS, payload });
const deleteCampusAction = (payload) => ({ type: DELETE_CAMPUS, payload });
const getCampusAction = (payload) => ({ type: GET_CAMPUS, payload });

export const createCampus = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createCampusUrl, payload);
      dispatch(createCampusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create campus", error);
      throw error;
    }
  };
};

export const updateCampus = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCampusUrl}/${id}`, payload);
      dispatch(updateCampusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update campus", error);
      throw error;
    }
  };
};


export const getAllCampus = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllCampusUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllCampusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all campus", error);
      throw error;
    }
  };
};


export const deleteCampus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCampusUrl}/${id}`);
      dispatch(deleteCampusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete campus", error);
      throw error;
    }
  };
};

export const getCampus = (country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getCampusUrl}?country=${country}`);
      dispatch(getCampusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get campus", error);
      throw error;
    }
  };
}