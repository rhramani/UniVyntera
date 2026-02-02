import Axios from "../../api.js";
import {
  createAiCallLeadUrl,
  deleteAiCallLeadUrl,
  getAllAiCallLeadUrl,
  getOneAiCallLeadUrl,
  updateAiCallLeadUrl,
} from "../routes/AiCallLead.route.js";

export const CREATE_AI_CALL_LEAD = "CREATE_AI_CALL_LEAD";
export const UPDATE_AI_CALL_LEAD = "UPDATE_AI_CALL_LEAD";
export const GET_ALL_AI_CALL_LEAD = "GET_ALL_AI_CALL_LEAD";
export const GET_ONE_AI_CALL_LEAD = "GET_ONE_AI_CALL_LEAD";
export const DELETE_AI_CALL_LEAD = "DELETE_AI_CALL_LEAD";

const createAiCallLeadAction = (payload) => ({
  type: CREATE_AI_CALL_LEAD,
  payload,
});
const updateAiCallLeadAction = (payload) => ({
  type: UPDATE_AI_CALL_LEAD,
  payload,
});
const getAllAiCallLeadAction = (payload) => ({
  type: GET_ALL_AI_CALL_LEAD,
  payload,
});
const getOneAiCallLeadAction = (payload) => ({
  type: GET_ONE_AI_CALL_LEAD,
  payload,
});
const deleteAiCallLeadAction = (payload) => ({
  type: DELETE_AI_CALL_LEAD,
  payload,
});

export const createAiCallLead = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createAiCallLeadUrl}`, payload);
      dispatch(createAiCallLeadAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateAiCallLead = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateAiCallLeadUrl}/${id}`, payload);
      dispatch(updateAiCallLeadAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllAiCallLead = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllAiCallLeadUrl}?page=${payload.page}&limit=${payload.limit}&search=${payload.search}&status=${payload.status}&assignId=${payload.assignId}&lead_from=${payload.lead_from}&startDate=${payload.startDate}&endDate=${payload.endDate}&branchId=${payload.branchId}&showAll=${payload.showAll}&leadActivity=${payload.leadActivity}&country=${payload.country}&followUpType=${payload.followUpType}`
      );
      dispatch(getAllAiCallLeadAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOneAiCallLead = (id) => {
  console.log("🚀 ~ getOneAiCallLead ~ id:", id)
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneAiCallLeadUrl}/${id}`);
      dispatch(getOneAiCallLeadAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteAiCallLead = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteAiCallLeadUrl}/${id}`);
      dispatch(deleteAiCallLeadAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
