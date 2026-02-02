import Axios from "../../../api";
import {
  createVisitorSubStatusUrl,
  deleteVisitorSubStatusUrl,
  getAllVisitorSubStatusUrl,
  getOneVisitorSubStatusUrl,
  updateVisitorSubStatusUrl,
} from "../../routes/Visitor/VisitorSubStatus.route";

export const CREATE_VISITOR_SUB_STATUS = "CREATE_VISITOR_SUB_STATUS";
export const UPDATE_VISITOR_SUB_STATUS = "UPDATE_VISITOR_SUB_STATUS";
export const GET_ONE_VISITOR_SUB_STATUS = "GET_ONE_VISITOR_SUB_STATUS";
export const GET_ALL_VISITOR_SUB_STATUS = "GET_ALL_VISITOR_SUB_STATUS";
export const DELETE_VISITOR_SUB_STATUS = "DELETE_VISITOR_SUB_STATUS";

const createVisitorSubStatusAction = (data) => {
  return {
    type: CREATE_VISITOR_SUB_STATUS,
    payload: data,
  };
};

const updateVisitorSubStatusAction = (data) => {
  return {
    type: UPDATE_VISITOR_SUB_STATUS,
    payload: data,
  };
};

const getOneVisitorSubStatusAction = (data) => {
  return {
    type: GET_ONE_VISITOR_SUB_STATUS,
    payload: data,
  };
};

const getAllVisitorSubStatusAction = (data) => {
  return {
    type: GET_ALL_VISITOR_SUB_STATUS,
    payload: data,
  };
};

const deleteVisitorSubStatusAction = (data) => {
  return {
    type: DELETE_VISITOR_SUB_STATUS,
    payload: data,
  };
};

export const createVisitorSubStatus = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createVisitorSubStatusUrl}`, payload);
      dispatch(createVisitorSubStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const updateVisitorSubStatus = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(
        `${updateVisitorSubStatusUrl}/${id}`,
        payload
      );
      dispatch(updateVisitorSubStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const getOneVisitorSubStatus = (mainTab) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneVisitorSubStatusUrl}?mainTab=${mainTab}`);
      dispatch(getOneVisitorSubStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const getAllVisitorSubStatus = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllVisitorSubStatusUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllVisitorSubStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const deleteVisitorSubStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteVisitorSubStatusUrl}/${id}`);
      dispatch(deleteVisitorSubStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};
