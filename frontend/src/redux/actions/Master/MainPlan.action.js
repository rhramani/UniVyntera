import Axios from "../../../api.js";
import {
  createMainPlanUrl,
  deleteMainPlanUrl,
  getAllMainPlanUrl,
  getOneMainPlanUrl,
  updateMainPlanUrl,
} from "../../routes/Master/MainPlan.route";

export const CREATE_MAIN_PLAN = "CREATE_MAIN_PLAN";
export const UPDATE_MAIN_PLAN = "UPDATE_MAIN_PLAN";
export const GETONE_MAIN_PLAN = "GETONE_MAIN_PLAN";
export const GETALL_MAIN_PLAN = "GETALL_MAIN_PLAN";
export const DELETE_MAIN_PLAN = "DELETE_MAIN_PLAN";

const createMainPlanAction = (payload) => ({ type: CREATE_MAIN_PLAN, payload });
const updateMainPlanAction = (payload) => ({ type: UPDATE_MAIN_PLAN, payload });
const getOneMainPlanAction = (payload) => ({ type: GETONE_MAIN_PLAN, payload });
const getAllMainPlanAction = (payload) => ({ type: GETALL_MAIN_PLAN, payload });
const deleteMainPlanAction = (payload) => ({ type: DELETE_MAIN_PLAN, payload });

export const createMainPlan = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createMainPlanUrl, payload);
      dispatch(createMainPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create Main plan");
      throw error;
    }
  };
};

export const updateMainPlan = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateMainPlanUrl}/${id}`, payload);
      dispatch(updateMainPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update Main plan");
      throw error;
    }
  };
};

export const getOneMainPlan = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getOneMainPlanUrl}/${id}`
      );
      dispatch(getOneMainPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll Main plan");
      throw error;
    }
  };
};

export const getAllMainPlan = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllMainPlanUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllMainPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll Main plan");
      throw error;
    }
  };
};

export const deleteMainPlan = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteMainPlanUrl}/${id}`);
      dispatch(deleteMainPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete Main plan");
      throw error;
    }
  };
};
