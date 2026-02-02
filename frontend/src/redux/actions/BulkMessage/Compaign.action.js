import Axios from "../../../api";
import {
  createCampaignUrl,
  getCampaignUrl,
  getOneReportCampaignUrl,
  sendSingleMessageUrl,
  dashboardSummaryUrl,
  logsCampaignUrl,
  reportCampaignUrl,
} from "../../routes/BulkMessage/Campaign.route";

export const ADD_CAMPAIGN = "ADD_CAMPAIGN";
export const GET_CAMPAIGN = "GET_CAMPAIGN";
export const REPORT_CAMPAIGN = "REPORT_CAMPAIGN";
export const LOGS_CAMPAIGN = "LOGS_CAMPAIGN";
export const DASHBOARD_SUMMARY = "DASHBOARD_SUMMARY";
export const GET_REPORT_CAMPAIGN = "GET_REPORT_CAMPAIGN";
export const SEND_SINGLE_MESSAGE = "SEND_SINGLE_MESSAGE";

const getAllCampign = (payload) => ({ type: GET_CAMPAIGN, payload: payload });
const createcampaignAction = (payload) => ({
  type: ADD_CAMPAIGN,
  payload: payload,
});

export const getReportCampaignAction = (payload) => ({
  type: GET_REPORT_CAMPAIGN,
  payload: payload,
});

export const sendSingleMessageAction = (payload) => ({
  type: SEND_SINGLE_MESSAGE,
  payload: payload,
});

export const dashboardSummaryAction = (payload) => ({
  type: DASHBOARD_SUMMARY,
  payload: payload,
});

export const logsCampaignAction = (payload) => ({
  type: LOGS_CAMPAIGN,
  payload: payload,
});

export const reportCampaignAction = (payload) => ({
  type: REPORT_CAMPAIGN,
  payload: payload,
});

export const createCampaign = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createCampaignUrl, payload);
      dispatch(createcampaignAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create campaign", error);
      throw error;
    }
  };
};

export const getCampaign = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(getCampaignUrl);
      dispatch(getAllCampign(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create campaign", error);
      throw error;
    }
  };
};

export const getReportCampaign = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneReportCampaignUrl}/${id}/report`);
      dispatch(getReportCampaignAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create campaign", error);
      throw error;
    }
  };
};

export const sendSingleMessage = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${sendSingleMessageUrl}`, payload);
      dispatch(sendSingleMessageAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create campaign", error);
      throw error;
    }
  };
}
export const dashboardSummary = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${dashboardSummaryUrl}`);
      dispatch(dashboardSummaryAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create campaign", error);
      throw error;
    }
  };
}

export const logsCampaign = (campaignId) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${logsCampaignUrl}/${campaignId}/logs`);
      dispatch(logsCampaignAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create campaign", error);
      throw error;
    }
  };
}

export const reportCampaign = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${reportCampaignUrl}`);
      dispatch(reportCampaignAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create campaign", error);
      throw error;
    }
  };
}