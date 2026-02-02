import Axios from "../../../api";
import { createSubPlanUrl, deleteSubPlanUrl, getAllSubPlanUrl, getOneSubPlanUrl, updateSubPlanUrl } from "../../routes/Master/SubPlan.route";

export const CREATE_SUB_PLAN = "CREATE_SUB_PLAN";
export const UPDATE_SUB_PLAN = "UPDATE_SUB_PLAN";
export const GETONE_SUB_PLAN = "GETONE_SUB_PLAN";
export const GETALL_SUB_PLAN = "GETALL_SUB_PLAN";
export const DELETE_SUB_PLAN = "DELETE_SUB_PLAN";

const createSubPlanAction = (payload) => ({ type: CREATE_SUB_PLAN, payload });
const updateSubPlanAction = (payload) => ({ type: UPDATE_SUB_PLAN, payload });
const getOneSubPlanAction = (payload) => ({ type: GETONE_SUB_PLAN, payload });
const getAllSubPlanAction = (payload) => ({ type: GETALL_SUB_PLAN, payload });
const deleteSubPlanAction = (payload) => ({ type: DELETE_SUB_PLAN, payload });

export const createSubPlan = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createSubPlanUrl, payload);
      dispatch(createSubPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create Sub plan");
      throw error;
    }
  };
};

export const updateSubPlan = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateSubPlanUrl}/${id}`, payload);
      dispatch(updateSubPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update Sub plan");
      throw error;
    }
  };
};

export const getOneSubPlan = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneSubPlanUrl}/${id}`);
      dispatch(getOneSubPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll Sub plan");
      throw error;
    }
  };
};

export const getAllSubPlan = (page = 1, limit = 10, search = "", mainPlan, country = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllSubPlanUrl}?page=${page}&limit=${limit}&search=${search}&mainPlan=${mainPlan}&country=${country}`
      );
      dispatch(getAllSubPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll Sub plan");
      throw error;
    }
  };
};

export const deleteSubPlan = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteSubPlanUrl}/${id}`);
      dispatch(deleteSubPlanAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete Sub plan");
      throw error;
    }
  };
};
