import Axios from "../../../api.js";
import {
  createFollowUpTypeUrl,
  deleteFollowUpTypeUrl,
  getAllFollowUpTypeUrl,
  updateFollowUpTypeUrl,
} from "../../routes/Lead/FollowUpType.route.js";

export const CREATE_FOLLOW_UP_TYPE = "CREATE_FOLLOW_UP_TYPE";
export const UPDATE_FOLLOW_UP_TYPE = "UPDATE_FOLLOW_UP_TYPE";
export const GET_ALL_FOLLOW_UP_TYPE = "GET_ALL_FOLLOW_UP_TYPE";
export const DELETE_FOLLOW_UP_TYPE = "DELETE_FOLLOW_UP_TYPE";

const createFollowUpTypeAction = (payload) => ({
  type: CREATE_FOLLOW_UP_TYPE,
  payload,
});
const updateFollowUpTypeAction = (payload) => ({
  type: UPDATE_FOLLOW_UP_TYPE,
  payload,
});
const getAllFollowUpTypeAction = (payload) => ({
  type: GET_ALL_FOLLOW_UP_TYPE,
  payload,
});
const deleteFollowUpTypeAction = (payload) => ({
  type: DELETE_FOLLOW_UP_TYPE,
  payload,
});

export const createFollowUpType = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createFollowUpTypeUrl, payload);
      dispatch(createFollowUpTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create Follow-Up Type:", error);
      throw error;
    }
  };
};

export const updateFollowUpType = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateFollowUpTypeUrl}/${id}`, payload);
      dispatch(updateFollowUpTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update Follow-Up Type:", error);
      throw error;
    }
  };
};

export const getAllFollowUpType = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllFollowUpTypeUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllFollowUpTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all Follow-Up Type:", error);
      throw error;
    }
  };
};

export const deleteFollowUpType = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteFollowUpTypeUrl}/${id}`);
      dispatch(deleteFollowUpTypeAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete Follow-Up Type:", error);
      throw error;
    }
  };
};
