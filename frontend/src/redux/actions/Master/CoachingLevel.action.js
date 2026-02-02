import Axios from "../../../api.js";
import { createLevelUrl, deleteLevelUrl, getAllLevelUrl, updateLevelUrl } from "../../routes/Master/CoachingLevel.route";

export const CREATE_LEVEL = "CREATE_LEVEL";
export const UPDATE_LEVEL = "UPDATE_LEVEL";
export const GET_ALL_LEVEL = "GET_ALL_LEVEL";
export const DELETE_LEVEL = "DELETE_LEVEL";

const createLevelAction = (payload) => {
    return {
        type: CREATE_LEVEL,
        payload: payload,
    };
};

const updateLevelAction = (payload) => {
    return {
        type: UPDATE_LEVEL,
        payload: payload,
    };
};

const getAllLevelAction = (payload) => {
    return {
        type: GET_ALL_LEVEL,
        payload: payload,
    };
};

const deleteLevelAction = (payload) => {
    return {
        type: DELETE_LEVEL,
        payload: payload,
    };
};

export const createLevel = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createLevelUrl, payload);
      dispatch(createLevelAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create Level", error);
      throw error;
    }
  };
};

export const updateLevel = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateLevelUrl}/${id}`, payload);
      dispatch(updateLevelAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update Level", error);
      throw error;
    }
  };
};


export const getAllLevel = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllLevelUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllLevelAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Level", error);
      throw error;
    }
  };
};


export const deleteLevel = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteLevelUrl}/${id}`);
      dispatch(deleteLevelAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete Level", error);
      throw error;
    }
  };
};
