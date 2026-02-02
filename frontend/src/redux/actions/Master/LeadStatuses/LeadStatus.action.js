import Axios from "../../../../api.js";
import {
  createLeadStatusUrl,
  deleteLeadStatusUrl,
  getAllLeadStatusUrl,
  getOneLeadStatusUrl,
  updateLeadStatusUrl,
  createB2BLeadStatusUrl,
  updateB2BLeadStatusUrl,
  getOneB2BLeadStatusUrl,
  getAllB2BLeadStatusUrl,
  deleteB2BLeadStatusUrl,
} from "../../../routes/Master/LeadStatuses/LeadStatus.route.js";

export const CREATE_LEAD_STATUS = "CREATE_LEAD_STATUS";
export const UPDATE_LEAD_STATUS = "UPDATE_LEAD_STATUS";
export const GET_ONE_LEAD_STATUS = "GET_ONE_LEAD_STATUS";
export const GET_ALL_LEAD_STATUS = "GET_ALL_LEAD_STATUS";
export const DELETE_LEAD_STATUS = "DELETE_LEAD_STATUS";

// b2b lead status
export const CREATE_B2B_LEAD_STATUS = "CREATE_B2B_LEAD_STATUS";
export const UPDATE_B2B_LEAD_STATUS = "UPDATE_B2B_LEAD_STATUS";
export const GET_ONE_B2B_LEAD_STATUS = "GET_ONE_B2B_LEAD_STATUS";
export const GET_ALL_B2B_LEAD_STATUS = "GET_ALL_B2B_LEAD_STATUS";
export const DELETE_B2B_LEAD_STATUS = "DELETE_B2B_LEAD_STATUS";

const createLeadStatusAction = (payload) => ({
  type: CREATE_LEAD_STATUS,
  payload,
});
const updateLeadStatusAction = (payload) => ({
  type: UPDATE_LEAD_STATUS,
  payload,
});
const getOneLeadStatusAction = (payload) => ({
  type: GET_ONE_LEAD_STATUS,
  payload,
});
const getAllLeadStatusAction = (payload) => ({
  type: GET_ALL_LEAD_STATUS,
  payload,
});
const deleteLeadStatusAction = (payload) => ({
  type: DELETE_LEAD_STATUS,
  payload,
});

// b2b lead status
const createB2BLeadStatusAction = (payload) => ({
  type: CREATE_B2B_LEAD_STATUS,
  payload,
});
const updateB2BLeadStatusAction = (payload) => ({
  type: UPDATE_B2B_LEAD_STATUS,
  payload,
});
const getOneB2BLeadStatusAction = (payload) => ({
  type: GET_ONE_B2B_LEAD_STATUS,
  payload,
});
const getAllB2BLeadStatusAction = (payload) => ({
  type: GET_ALL_B2B_LEAD_STATUS,
  payload,
});
const deleteB2BLeadStatusAction = (payload) => ({
  type: DELETE_B2B_LEAD_STATUS,
  payload,
});

export const createLeadStatus = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createLeadStatusUrl}`, payload);
      dispatch(createLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateLeadStatus = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateLeadStatusUrl}/${id}`, payload);
      dispatch(updateLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOneLeadStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneLeadStatusUrl}/${id}`);
      dispatch(getOneLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllLeadStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllLeadStatusUrl}?search=${search}`);
      dispatch(getAllLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteLeadStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteLeadStatusUrl}/${id}`);
      dispatch(deleteLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

// b2b lead status
export const createB2BLeadStatus = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createB2BLeadStatusUrl}`, payload);
      dispatch(createB2BLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateB2BLeadStatus = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateB2BLeadStatusUrl}/${id}`, payload);
      dispatch(updateB2BLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOneB2BLeadStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneB2BLeadStatusUrl}/${id}`);
      dispatch(getOneB2BLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllB2BLeadStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllB2BLeadStatusUrl}?search=${search}`);
      dispatch(getAllB2BLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteB2BLeadStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteB2BLeadStatusUrl}/${id}`);
      dispatch(deleteB2BLeadStatusAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
