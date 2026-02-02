import Axios from "../../../api.js";
import {
  getAllbranchPerformanceReportUrl,
  getAllBranchWiseAdmissionsReportUrl,
  getAllCoachingReportUrl,
  getAllCounselorPerformanceReportUrl,
  getAllLeadFromReportUrl,
  getAllOverallReportUrl,
  getAllVisaCollectionReportUrl,
  getAllVisaNumberCounselorReportUrl,
  getAllVisitorVisaReportUrl,
} from "../../routes/Report/OverallReports.route.js";

export const GET_ALL_OVERALL_REPORT = "GET_ALL_OVERALL_REPORT";
export const GET_ALL_LEAD_FROM_REPORT = "GET_ALL_LEAD_FROM_REPORT";
export const GET_ALL_VISA_NUMBER_COUNSELOR = "GET_ALL_VISA_NUMBER_COUNSELOR";
export const GET_ALL_COUNSELOR_PERFORMANCE = "GET_ALL_COUNSELOR_PERFORMANCE";
export const GET_ALL_BRANCH_WISE_ADMISSIONS = "GET_ALL_BRANCH_WISE_ADMISSIONS";
export const GET_ALL_BRANCH_PERFORMANCE = "GET_ALL_BRANCH_PERFORMANCE";
export const GET_ALL_DAY_WISE_ADMISSION = "GET_ALL_DAY_WISE_ADMISSION";
export const GET_ALL_VISA_COLLECTION = "GET_ALL_VISA_COLLECTION";
export const GET_ALL_VISITOR_VISA_REPORT = "GET_ALL_VISITOR_VISA_REPORT";
export const GET_ALL_COACHING_REPORT = "GET_ALL_COACHING_REPORT";

const getOverallAction = (data) => ({
  type: GET_ALL_OVERALL_REPORT,
  payload: data,
});

const getLeadFromAction = (data) => ({
  type: GET_ALL_LEAD_FROM_REPORT,
  payload: data,
});

const getVisaNumberCounselorAction = (data) => ({
  type: GET_ALL_VISA_NUMBER_COUNSELOR,
  payload: data,
});

const getCounselorPerformanceAction = (data) => ({
  type: GET_ALL_COUNSELOR_PERFORMANCE,
  payload: data,
});

const getbranchWiseAdmissionsAction = (data) => ({
  type: GET_ALL_BRANCH_WISE_ADMISSIONS,
  payload: data,
});

const getbranchPerformanceAction = (data) => ({
  type: GET_ALL_BRANCH_PERFORMANCE,
  payload: data,
});

const getDayWiseAdmissionAction = (data) => ({
  type: GET_ALL_DAY_WISE_ADMISSION,
  payload: data,
});

const getVisaCollectionAction = (data) => ({
  type: GET_ALL_VISA_COLLECTION,
  payload: data,
});

const getVisitorVisaReportAction = (data) => ({
  type: GET_ALL_VISITOR_VISA_REPORT,
  payload: data,
});

const getCoachingReportAction = (data) => ({
  type: GET_ALL_COACHING_REPORT,
  payload: data,
});

export const getAllOverallReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllOverallReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getOverallAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all lead from report", error);
      throw error;
    }
  };
};

export const getAllLeadFromReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllLeadFromReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getLeadFromAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all lead from report", error);
      throw error;
    }
  };
};

export const getAllVisaNumberCounselorReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllVisaNumberCounselorReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getVisaNumberCounselorAction(res.data));
      return res;
    } catch (error) {
      console.log(
        "Error fetching in get all Visa Number Counselor report",
        error
      );
      throw error;
    }
  };
};

export const getAllCounselorPerformanceReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllCounselorPerformanceReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getCounselorPerformanceAction(res.data));
      return res;
    } catch (error) {
      console.log(
        "Error fetching in get all Counselor Performance report",
        error
      );
      throw error;
    }
  };
};

export const getAllBranchWiseAdmissionsReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllBranchWiseAdmissionsReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getbranchWiseAdmissionsAction(res.data));
      return res;
    } catch (error) {
      console.log(
        "Error fetching in get all Branch Wise Admissions report",
        error
      );
      throw error;
    }
  };
};

export const getAllbranchPerformanceReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllbranchPerformanceReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getbranchPerformanceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Branch Performance report", error);
      throw error;
    }
  };
};

export const getAllDayWiseAdmissionReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllbranchPerformanceReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getDayWiseAdmissionAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Day wise admission report", error);
      throw error;
    }
  };
};

export const getAllVisaCollectionReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllVisaCollectionReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getVisaCollectionAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Visa Collection report", error);
      throw error;
    }
  };
};

export const getAllVisitorVisaReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllVisitorVisaReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getVisitorVisaReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Visitor Visa report", error);
      throw error;
    }
  };
};

export const getAllCoachingReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllCoachingReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getCoachingReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Coaching report", error);
      throw error;
    }
  };
};