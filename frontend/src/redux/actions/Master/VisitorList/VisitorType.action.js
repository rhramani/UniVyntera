import Axios from "../../../../api.js";
import {
  createVisitorTypeUrl,
  deleteVisitorTypeUrl,
  getAllVisitorTypeUrl,
  updateVisitorTypeUrl,
} from "../../../routes/Master/VisitorList/VisitorType.route.js";

export const CREATE_VISITOR_TYPE = "CREATE_VISITOR_TYPE";
export const UPDATE_VISITOR_TYPE = "UPDATE_VISITOR_TYPE";
export const GET_ALL_VISITOR_TYPE = "GET_ALL_VISITOR_TYPE";
export const DELETE_VISITOR_TYPE = "DELETE_VISITOR_TYPE";

const createVisitorTypeAction = (payload) => ({
  type: CREATE_VISITOR_TYPE,
  payload,
});
const updateVisitorTypeAction = (payload) => ({
  type: UPDATE_VISITOR_TYPE,
  payload,
});
const getAllVisitorTypeAction = (payload) => ({
  type: GET_ALL_VISITOR_TYPE,
  payload,
});
const deleteVisitorTypeAction = (payload) => ({
  type: DELETE_VISITOR_TYPE,
  payload,
});

export const createVisitorType = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createVisitorTypeUrl, payload);
      dispatch(createVisitorTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create VisitorType:", error);
      throw error;
    }
  };
};

export const updateVisitorType = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateVisitorTypeUrl}/${id}`, payload);
      dispatch(updateVisitorTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update VisitorType:", error);
      throw error;
    }
  };
};

export const getAllVisitorType = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllVisitorTypeUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllVisitorTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all VisitorType:", error);
      throw error;
    }
  };
};

export const deleteVisitorType = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteVisitorTypeUrl}/${id}`);
      dispatch(deleteVisitorTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete VisitorType:", error);
      throw error;
    }
  };
};
