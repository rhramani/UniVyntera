import Axios from "../../../api";
import {
  createVisitorMainStatusUrl,
  deleteVisitorMainStatusUrl,
  getAllVisitorMainStatusUrl,
  getOneVisitorMainStatusUrl,
  updateVisitorMainStatusUrl,
} from "../../routes/Visitor/VisitorMainStatus.route";

export const CREATE_VISITOR_MAIN_STATUS = "CREATE_VISITOR_MAIN_STATUS";
export const UPDATE_VISITOR_MAIN_STATUS = "UPDATE_VISITOR_MAIN_STATUS";
export const GET_ONE_VISITOR_MAIN_STATUS = "GET_ONE_VISITOR_MAIN_STATUS";
export const GET_ALL_VISITOR_MAIN_STATUS = "GET_ALL_VISITOR_MAIN_STATUS";
export const DELETE_VISITOR_MAIN_STATUS = "DELETE_VISITOR_MAIN_STATUS";

export const createVisitorMainStatusAction = (data) => ({
  type: CREATE_VISITOR_MAIN_STATUS,
  payload: data,
});

export const updateVisitorMainStatusAction = (data) => ({
  type: UPDATE_VISITOR_MAIN_STATUS,
  payload: data,
});

export const getOneVisitorMainStatusAction = (data) => ({
  type: GET_ONE_VISITOR_MAIN_STATUS,
  payload: data,
});
export const getAllVisitorMainStatusAction = (data) => ({
  type: GET_ALL_VISITOR_MAIN_STATUS,
  payload: data,
});
export const deleteVisitorMainStatusAction = (data) => ({
  type: DELETE_VISITOR_MAIN_STATUS,
  payload: data,
});

export const createVisitorMainStatus = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createVisitorMainStatusUrl}`, payload);
      dispatch(createVisitorMainStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const updateVisitorMainStatus = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(
        `${updateVisitorMainStatusUrl}/${id}`,
        payload
      );
      dispatch(updateVisitorMainStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const getOneVisitorMainStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneVisitorMainStatusUrl}/${id}`);
      dispatch(getOneVisitorMainStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const getAllVisitorMainStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllVisitorMainStatusUrl}?search=${search}`);
      dispatch(getAllVisitorMainStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};

export const deleteVisitorMainStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteVisitorMainStatusUrl}/${id}`);
      dispatch(deleteVisitorMainStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
};
