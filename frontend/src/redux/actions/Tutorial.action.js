import Axios from "../../api.js";
import { tutorialCreateUrl, tutorialDeleteUrl, tutorialGetAllUrl, tutorialGetOneUrl, tutorialUpdateUrl } from "../routes/Tutorial.route";

export const CREATE_TUTORIAL = "CREATE_TUTORIAL";
export const UPDATE_TUTORIAL = "UPDATE_TUTORIAL";
export const GET_ALL_TUTORIAL = "GET_ALL_TUTORIAL";
export const DELETE_TUTORIAL = "DELETE_TUTORIAL";
export const GET_ONE_TUTORIAL = "GET_ONE_TUTORIAL";

const createTutorialAction = (payload) => ({
  type: CREATE_TUTORIAL,
  payload,
});
const updateTutorialAction = (payload) => ({
  type: UPDATE_TUTORIAL,
  payload,
});
const getAllTutorialAction = (payload) => ({
  type: GET_ALL_TUTORIAL,
  payload,
});
const deleteTutorialAction = (payload) => ({
  type: DELETE_TUTORIAL,
  payload,
});
const getOneTutorialAction = (payload) => ({
  type: GET_ONE_TUTORIAL,
  payload,
});

export const createTutorial = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${tutorialCreateUrl}`, payload);
      dispatch(createTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateTutorial = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${tutorialUpdateUrl}/${id}`, payload);
      dispatch(updateTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllTutorial = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${tutorialGetAllUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteTutorial = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${tutorialDeleteUrl}/${id}`);
      dispatch(deleteTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOneTutorial = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${tutorialGetOneUrl}/${id}`);
      dispatch(getOneTutorialAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
