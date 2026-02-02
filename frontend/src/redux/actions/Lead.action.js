import Axios from "../../api.js";
import axios from "axios";

import {
  bulkLead,
  convertToApplicationUrl,
  counsellorList,
  downloadData,
  editHistoryUrl,
  followUpLeadByDateUrl,
  followUpLeadsUrl,
  getB2BLeadUrl,
  getLeadByAssignedUserUrl,
  getLeadByAssignUserIdUrl,
  getLeadCountryUrl,
  getLeadFromUrl,
  getTodaysBirthdayLeadUrl,
  leadAddUrl,
  leadBulkDelete,
  leadByFilter,
  leadById,
  leadDelete,
  leadListUrl,
  leadUpdate,
  bulkLeadAssign,
  sendWPMessageUrl,
  getApplicationProcess,
  getPendingFollowUpsUrl,
  addCtcCallingUrl,
} from "../routes/Lead.route.js";

export const ADD_LEAD = "ADD_LEAD";
export const GET_LEAD = "GET_LEAD";
export const GET_LEAD_BY_ID = "GET_LEAD_BY_ID";
export const UPDATE_LEAD = "UPDATE_LEAD";
export const DELETE_LEAD = "DELETE_LEAD";
export const FILTER_WISE_DATA = "FILTER_WISE_DATA";
export const DOWNLOAD_DATA = "DOWNLOAD_DATA";
export const INSERT_MANY = "INSERT_MANY";
export const DELETE_MANY_LEAD = "DELETE_MANY_LEAD";
export const GET_ALL_COUNSELLOR = "GET_ALL_COUNSELLOR";
export const FOLLOW_UP_LEAD_BY_DATE = "FOLLOW_UP_LEAD_BY_DATE";
export const FOLLOW_UP_LEAD = "FOLLOW_UP_LEAD";
export const EDIT_HISTORY = "EDIT_HISTORY";
export const CONVERT_TO_APPLICATION = "CONVERT_TO_APPLICATION";
export const GET_LEAD_BY_ASSIGN_USER_ID = "GET_LEAD_BY_ASSIGN_USER_ID";
export const GET_LEAD_BY_ASSIGN_USER = "GET_LEAD_BY_ASSIGN_USER";
export const SEND_WP_MESSAGE = "SEND_WP_MESSAGE";
export const GET_LEAD_FROM = "GET_LEAD_FROM";
export const GET_LEAD_COUNTRY = "GET_LEAD_COUNTRY";
export const GET_TODAYS_BIRTHDAY_LEAD = "GET_TODAYS_BIRTHDAY_LEAD";
export const GET_B2B_LEAD = "GET_B2B_LEAD";
export const GET_PENDING_FOLLOW_UPS = "GET_PENDING_FOLLOW_UPS";

// application process
export const GET_APPLICATION_PROCESS = "GET_APPLICATION_PROCESS";

// ctc calling
export const ADD_CTC_CALLING = "ADD_CTC_CALLING";

const addLeadAction = (payload) => ({ type: ADD_LEAD, payload });
const getLeadAction = (payload) => ({ type: GET_LEAD, payload });
const getLeadByIdAction = (payload) => ({ type: GET_LEAD_BY_ID, payload });
const updateLeadAction = (payload) => ({ type: UPDATE_LEAD, payload });
const deleteLeadAction = (payload) => ({ type: DELETE_LEAD, payload });
const filterWiseDataAction = (payload) => ({ type: FILTER_WISE_DATA, payload });
const downloadDataAction = (payload) => ({ type: DOWNLOAD_DATA, payload });
const insertManyAction = (payload) => ({ type: INSERT_MANY, payload });
const deleteManyLeadAction = (payload) => ({ type: DELETE_MANY_LEAD, payload });
const getAllCounsellorAction = (payload) => ({
  type: GET_ALL_COUNSELLOR,
  payload,
});
const followUpLeadByDateAction = (payload) => ({
  type: FOLLOW_UP_LEAD_BY_DATE,
  payload,
});
const followUpLeadAction = (payload) => ({ type: FOLLOW_UP_LEAD, payload });
const editHistoryAction = (payload) => ({ type: EDIT_HISTORY, payload });
const convertToApplicationAction = (payload) => ({
  type: CONVERT_TO_APPLICATION,
  payload,
});
const getLeadByAssignUserIdAction = (payload) => ({
  type: GET_LEAD_BY_ASSIGN_USER_ID,
  payload,
});
const getLeadByAssignUserAction = (payload) => ({
  type: GET_LEAD_BY_ASSIGN_USER,
  payload,
});
const sendWPMessageAction = (payload) => ({ type: SEND_WP_MESSAGE, payload });
const getLeadFromAction = (payload) => ({ type: GET_LEAD_FROM, payload });
const getLeadCountryAction = (payload) => ({ type: GET_LEAD_COUNTRY, payload });
const getTodaysBirthdayLeadAction = (payload) => ({
  type: GET_TODAYS_BIRTHDAY_LEAD,
  payload,
});

const getB2BLeadAction = (payload) => ({ type: GET_B2B_LEAD, payload });
const getPendingFollowUpsAction = (payload) => ({
  type: GET_PENDING_FOLLOW_UPS,
  payload,
});

// application process
const getApplicationProcessAction = (payload) => ({
  type: GET_APPLICATION_PROCESS,
  payload,
});

// ctc calling
const addCtcCallingAction = (payload) => ({ type: ADD_CTC_CALLING, payload });

export const getAllCounsellor = (roleId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get(`${counsellorList}/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getAllCounsellorAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const addLead = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${leadAddUrl}`, payload);
      dispatch(addLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const insertMany = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${bulkLead}`, payload);
      dispatch(insertManyAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const downloadLeads = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${downloadData}?search=${payload.search}&status=${
          payload.status
        }&subStatus=${payload.subStatus}&assignId=${
          payload.assignId
        }&lead_from=${payload.lead_from}&startDate=${
          payload.startdate
        }&endDate=${payload.enddate}&branchId=${payload.branchId}&showAll=${
          payload.showAll
        }&leadActivity=${payload.leadActivity}&country=${
          payload.country || ""
        }&followUpType=${payload.followUpType}&assignRole=${payload.assignRole}`
      );
      dispatch(downloadDataAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getLead = (payload) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (
        payload.userId ||
        payload.search ||
        payload.status ||
        payload.searchOnField ||
        payload.subStatus ||
        payload.startdate ||
        payload.enddate ||
        payload.assignId ||
        payload.lead_from ||
        payload.branchId ||
        payload.showAll ||
        payload.leadActivity ||
        payload.country ||
        payload.followUpType ||
        payload.assignRole ||
        payload.otherService ||
        payload.updatedOn
      ) {
        const res = await axios.get(
          `${leadListUrl}?page=${payload.page}&limit=${
            payload.limit
          }&searchOnField=${payload.searchOnField}&search=${
            payload.search
          }&status=${payload.status}&subStatus=${payload.subStatus}&startDate=${
            payload.startdate
          }&endDate=${payload.enddate}&assignId=${payload.assignId}&lead_from=${
            payload.lead_from
          }&branchId=${payload.branchId}&showAll=${
            payload.showAll
          }&leadActivity=${payload.leadActivity}&country=${
            payload.country || ""
          }&followUpType=${payload.followUpType}&assignRole=${payload.assignRole}&otherService=${
            payload.otherService || ""
          }&updatedOn=${payload.updatedOn}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(getLeadAction(res.data));
        return res;
      } else {
        const res = await axios.get(
          `${leadListUrl}?page=${payload.page}&limit=${payload.limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(getLeadAction(res.data));
        return res;
      }
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const filterWiseLead = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${leadByFilter}?startDate=${payload.startdate}&endDate=${payload.enddate}&status=${payload.status}&page=${payload.page}&limit=${payload.limit}`
      );
      dispatch(filterWiseDataAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getLeadByAssignUserId = (payload) => {
  return async (dispatch) => {
    try {
      if (
        payload.userId ||
        payload.search ||
        payload.status ||
        payload.searchOnField ||
        payload.subStatus ||
        payload.startdate ||
        payload.enddate ||
        payload.lead_from ||
        payload.leadActivity ||
        payload.country ||
        payload.followUpType ||
        payload.assignId ||
        payload.branchId ||
        payload.showAll ||
        payload.assignRole ||
        payload.updatedOn
      ) {
        const res = await Axios.get(
          `${getLeadByAssignUserIdUrl}/${payload.userId}?page=${payload.page}&limit=${payload.limit}&search=${payload.search}&searchOnField=${payload.searchOnField}&status=${payload.status}&subStatus=${payload.subStatus}&startDate=${payload.startdate}&endDate=${payload.enddate}&lead_from=${payload.lead_from}&leadActivity=${payload.leadActivity}&country=${payload.country}&followUpType=${payload.followUpType}&assignId=${payload.assignId}&branchId=${payload.branchId}&showAll=${payload.showAll}&assignRole=${payload.assignRole}&updatedOn=${payload.updatedOn}`
        );
        dispatch(getLeadByAssignUserIdAction(res.data));
        return res;
      }
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getLeadById = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${leadById}/${id}`);
      dispatch(getLeadByIdAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateLead = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${leadUpdate}/${id}`, payload);
      dispatch(updateLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const bulkUpdateLeadAssign = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(bulkLeadAssign, payload);
      dispatch(updateLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteLead = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${leadDelete}/${id}`);
      dispatch(deleteLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteManyLead = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${leadBulkDelete}`, payload);
      dispatch(deleteManyLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const followUpLeadByDate = (
  page = 1,
  limit = 10,
  search = "",
  searchOnField,
  date = null,
  country,
  followUpType,
  status,
  subStatus,
  lead_from,
  branchId,
  showAll,
  assignRole,
  assignId,
  leadActivity,
  updatedOn
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${followUpLeadByDateUrl}?page=${page}&limit=${limit}&search=${search}&searchOnField=${searchOnField}&date=${date}&country=${country}&followUpType=${followUpType}&status=${status}&subStatus=${subStatus}&lead_from=${lead_from}&branchId=${branchId}&showAll=${showAll}&assignRole=${assignRole}&assignId=${assignId}&leadActivity=${leadActivity}&updatedOn=${updatedOn}`
      );
      dispatch(followUpLeadByDateAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const followUpLeads = (
  page = 1,
  limit = 10,
  search = "",
  searchOnField,
  country,
  followUpType,
  status,
  subStatus,
  lead_from,
  leadActivity = "",
  startDate,
  endDate,
  branchId,
  showAll,
  assignRole,
  assignId,
  updatedOn
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${followUpLeadsUrl}?page=${page}&limit=${limit}&search=${search}&searchOnField=${searchOnField}&country=${country}&followUpType=${followUpType}&status=${status}&subStatus=${subStatus}&lead_from=${lead_from}&leadActivity=${leadActivity}&startDate=${startDate}&endDate=${endDate}&branchId=${branchId}&showAll=${showAll}&assignRole=${assignRole}&assignId=${assignId}&updatedOn=${updatedOn}`
      );
      dispatch(followUpLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const editHistory = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${editHistoryUrl}/${id}`);
      dispatch(editHistoryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const convertToApplication = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${convertToApplicationUrl}/${id}`, payload);
      dispatch(convertToApplicationAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const getLeadByAssignUser = (params) => {
  return async (dispatch) => {
    try {
      const fromB2B = params?.fromB2B || false;
      const res = await Axios.get(
        `${getLeadByAssignedUserUrl}?fromB2B=${fromB2B}`
      );
      dispatch(getLeadByAssignUserAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const sendWPMessage = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${sendWPMessageUrl}`, payload);
      dispatch(sendWPMessageAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const getLeadFrom = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getLeadFromUrl}`, payload);
      dispatch(getLeadFromAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const getLeadCountry = (params) => {
  return async (dispatch) => {
    try {
      const fromB2B = params?.fromB2B || false;
      const res = await Axios.get(`${getLeadCountryUrl}?fromB2B=${fromB2B}`);
      dispatch(getLeadCountryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const getTodaysBirthdayLeads = (
  page = 1,
  limit = 10,
  search = "",
  date
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getTodaysBirthdayLeadUrl}?page=${page}&limit=${limit}&search=${search}&date=${date}`
      );
      dispatch(getTodaysBirthdayLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const getB2BLead = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getB2BLeadUrl}?page=${payload.page}&limit=${
          payload.limit
        }&searchOnField=${payload.searchOnField}&search=${
          payload.search
        }&status=${payload.status}&subStatus=${payload.subStatus}&startDate=${
          payload.startdate
        }&endDate=${payload.enddate}&assignId=${payload.assignId}&lead_from=${
          payload.lead_from
        }&branchId=${payload.branchId}&showAll=${
          payload.showAll
        }&leadActivity=${payload.leadActivity}&country=${
          payload.country || ""
        }&followUpType=${payload.followUpType}&assignRole=${
          payload.assignRole
        }&updatedOn=${payload.updatedOn}&b2bId=${payload.b2bId}`
      );
      dispatch(getB2BLeadAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const getPendingFollowUpsLead = (payload) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (
        payload.userId ||
        payload.search ||
        payload.status ||
        payload.searchOnField ||
        payload.subStatus ||
        payload.startdate ||
        payload.enddate ||
        payload.assignId ||
        payload.lead_from ||
        payload.branchId ||
        payload.showAll ||
        payload.leadActivity ||
        payload.country ||
        payload.followUpType ||
        payload.assignRole ||
        payload.updatedOn
      ) {
        const res = await axios.get(
          `${getPendingFollowUpsUrl}?page=${payload.page}&limit=${
            payload.limit
          }&searchOnField=${payload.searchOnField}&search=${
            payload.search
          }&status=${payload.status}&subStatus=${payload.subStatus}&startDate=${
            payload.startdate
          }&endDate=${payload.enddate}&assignId=${payload.assignId}&lead_from=${
            payload.lead_from
          }&branchId=${payload.branchId}&showAll=${
            payload.showAll
          }&leadActivity=${payload.leadActivity}&country=${
            payload.country || ""
          }&followUpType=${payload.followUpType}&assignRole=${
            payload.assignRole
          }&updatedOn=${payload.updatedOn}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(getPendingFollowUpsAction(res.data));
        return res;
      } else {
        const res = await axios.get(
          `${getPendingFollowUpsUrl}?page=${payload.page}&limit=${payload.limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(getPendingFollowUpsAction(res.data));
        return res;
      }
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

// application process

export const applicationAndLeadProcess = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getApplicationProcess}/${id}`);
      dispatch(getApplicationProcessAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching application process:", error);
      throw error;
    }
  };
};

// ctc calling
export const addCtcCalling = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${addCtcCallingUrl}/${id}?entityType=${payload.entityType}`);
      dispatch(addCtcCallingAction(res.data));
      return res;
    } catch (error) {
      console.error("Error adding CTC calling:", error);
      throw error;
    }
  };
};