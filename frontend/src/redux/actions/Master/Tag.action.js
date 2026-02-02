import Axios from "../../../api.js";
import {
  createTagUrl,
  deleteTagUrl,
  getAllTagUrl,
  updateTagUrl,
} from "../../routes/Master/Tag.route";

export const CREATE_TAG = "CREATE_TAG";
export const UPDATE_TAG = "UPDATE_TAG";
export const GET_ALL_TAG = "GET_ALL_TAG";
export const DELETE_TAG = "DELETE_TAG";

const createTagAction = (data) => ({
  type: CREATE_TAG,
  payload: data,
});
const updateTagAction = (data) => ({
  type: UPDATE_TAG,
  payload: data,
});
const getAllTagAction = (data) => ({
  type: GET_ALL_TAG,
  payload: data,
});
const deleteTagAction = (data) => ({
  type: DELETE_TAG,
  payload: data,
});

export const createTag = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createTagUrl, payload);
      dispatch(createTagAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create tag", error);
      throw error;
    }
  };
};
export const updateTag = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateTagUrl}/${id}`, payload);
      dispatch(updateTagAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update tag", error);
      throw error;
    }
  };
};

export const getAllTag = (search) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllTagUrl}?search=${search}`);
      dispatch(getAllTagAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all tag", error);
      throw error;
    }
  };
};

export const deleteTag = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteTagUrl}/${id}`);
      dispatch(deleteTagAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete tag", error);
      throw error;
    }
  };
};
