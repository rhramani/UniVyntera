import Axios from "../../../api";
import {
  createApplicationTypeUrl,
  deleteApplicationTypeUrl,
  getAllApplicationTypeUrl,
  updateApplicationTypeUrl,
} from "../../routes/Master/ApplicationType.route";

export const CREATE_APPLICATION_TYPE = "CREATE_APPLICATION_TYPE";
export const UPDATE_APPLICATION_TYPE = "UPDATE_APPLICATION_TYPE";
export const GET_ALL_APPLICATION_TYPE = "GET_ALL_APPLICATION_TYPE";
export const DELETE_APPLICATION_TYPE = "DELETE_APPLICATION_TYPE";

const createApplicationTypeAction = (payload) => ({
  type: CREATE_APPLICATION_TYPE,
  payload,
});
const updateApplicationTypeAction = (payload) => ({
  type: UPDATE_APPLICATION_TYPE,
  payload,
});
const getAllApplicationTypeAction = (payload) => ({
  type: GET_ALL_APPLICATION_TYPE,
  payload,
});
const deleteApplicationTypeAction = (payload) => ({
  type: DELETE_APPLICATION_TYPE,
  payload,
});

export const createApplicationType = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createApplicationTypeUrl, payload);
      dispatch(createApplicationTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create ApplicationType:", error);
      throw error;
    }
  };
};

export const updateApplicationType = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateApplicationTypeUrl}/${id}`, payload);
      dispatch(updateApplicationTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update ApplicationType:", error);
      throw error;
    }
  };
};

export const getAllApplicationType = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllApplicationTypeUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllApplicationTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all ApplicationType:", error);
      throw error;
    }
  };
};

export const deleteApplicationType = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteApplicationTypeUrl}/${id}`);
      dispatch(deleteApplicationTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete ApplicationType:", error);
      throw error;
    }
  };
};
