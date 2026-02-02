import Axios from "../../api.js";
import { getAllDashboardTotalUrl, createCtcCallingForDashboardUrl, getAllInternalChatHistoryUrl, getAllInternalChatUserUrl } from "../routes/Dashboard.route.js";

export const GET_ALL_DASHBOARD_TOTAL = "GET_ALL_DASHBOARD_TOTAL";
export const CREATE_CTC_FOR_DASHBOARD_CALLING = "CREATE_CTC_FOR_DASHBOARD_CALLING";
export const GET_ALL_INTERNAL_CHAT_USER = "GET_ALL_INTERNAL_CHAT_USER";
export const GET_ALL_INTERNAL_CHAT_HISTORY = "GET_ALL_INTERNAL_CHAT_HISTORY";

const getAllDashboardTotalAction = (payload) => ({
  type: GET_ALL_DASHBOARD_TOTAL,
  payload,
});

const createCtcCallingForDashboardAction = (payload) => ({
  type: CREATE_CTC_FOR_DASHBOARD_CALLING,
  payload,
});

const getAllInternalChatUserAction = (payload) => ({
  type: GET_ALL_INTERNAL_CHAT_USER,
  payload,
});

const getAllInternalChatHistoryAction = (payload) => ({
  type: GET_ALL_INTERNAL_CHAT_HISTORY,
  payload,
});

export const getAllDashboardData = (
  startDate = "",
  endDate = "",
  branchId = "",
  headOffice = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllDashboardTotalUrl}?startDate=${startDate}&endDate=${endDate}&branchId=${branchId}&headOffice=${headOffice}`
      );
      dispatch(getAllDashboardTotalAction(res));
      return res;
    } catch (error) {
      console.log("Error fetching in dashboard total:", error);
      throw error;
    }
  };
};

export const createCtcCallingForDashboard = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createCtcCallingForDashboardUrl}`, payload);
      dispatch(createCtcCallingForDashboardAction(res.data));
      return res;
    } catch (error) {
      console.error("Error adding CTC calling:", error);
      throw error;
    }
  };
};


export const getAllInternalChatUser = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllInternalChatUserUrl}`);
      dispatch(getAllInternalChatUserAction(res.data));
      return res;
    } catch (error) {
      console.error("Error adding CTC calling:", error);
      throw error;
    }
  };
};

export const getAllInternalChatHistory = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllInternalChatHistoryUrl}/${id}`);
      dispatch(getAllInternalChatHistoryAction(res.data));
      return res;
    } catch (error) {
      console.error("Error adding CTC calling:", error);
      throw error;
    }
  };
};