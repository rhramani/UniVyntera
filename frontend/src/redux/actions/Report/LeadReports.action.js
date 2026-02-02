import Axios from "../../../api.js";
import {
  exportDataLeadReportsUrl,
  getAllLeadReportUrl,
  getAllSourceOfReferenceUrl,
} from "../../routes/Report/LeadReports.route.js";

export const GET_ALL_LEAD_REPORT = "GET_ALL_LEAD_REPORT";
export const GET_ALL_SOURSE_OF_REFERENCE = "GET_ALL_SOURSE_OF_REFERENCE";
export const EXPORT_DATA_LEAD_REPORTS = "EXPORT_DATA_LEAD_REPORTS";

const getLeadAction = (data) => ({
  type: GET_ALL_LEAD_REPORT,
  payload: data,
});
const getSourseOfReferenceAction = (data) => ({
  type: GET_ALL_SOURSE_OF_REFERENCE,
  payload: data,
});
const exportDataLeadReportsAction = (data) => ({
  type: EXPORT_DATA_LEAD_REPORTS,
  payload: data,
});

export const getAllLeadReport = (
  page = 1,
  limit = 10,
  search = "",
  searchOnField,
  source,
  status,
  subStatus,
  assignRole,
  assignId,
  branchId,
  showAll,
  startDate,
  endDate,
  leadActivity,
  country,
  followUpType,
  lead_from
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllLeadReportUrl}?page=${page}&limit=${limit}&search=${search}&searchOnField=${searchOnField}&source=${source}&status=${status}&subStatus=${subStatus}&leadActivity=${leadActivity}&country=${country}&assignRole=${assignRole}&assignId=${assignId}&branchId=${branchId}&showAll=${showAll}&startDate=${startDate}&endDate=${endDate}&leadActivity=${leadActivity}&country=${country}&followUpType=${followUpType}&lead_from=${lead_from}`
      );
      dispatch(getLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all lead report", error);
      throw error;
    }
  };
};

export const getAllSourceOfReference = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllSourceOfReferenceUrl}`);
      dispatch(getSourseOfReferenceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get Source Of Reference", error);
      throw error;
    }
  };
};

export const exportDataLeadReports = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${exportDataLeadReportsUrl}?ids=${ids}`);
      dispatch(exportDataLeadReportsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get Source Of Reference", error);
      throw error;
    }
  };
};
