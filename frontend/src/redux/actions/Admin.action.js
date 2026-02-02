import Axios from "../../api.js";
import {
  adminDeleteUrl,
  adminGetAllUrl,
  adminGetOneUrl,
  adminLoginUrl,
  adminRegistrationUrl,
  adminRequestOTPUrl,
  adminUpdateUrl,
  ipRestrictionUrl,
  loginHistoryUrl,
  memberUrl,
} from "../routes/Admin.route";

export const LOGIN_ADMIN = "LOGIN_ADMIN";
export const REGISTER_ADMIN = "REGISTER_ADMIN";
export const REQUEST_OTP_ADMIN = "REQUEST_OTP_ADMIN";
export const UPDATE_ADMIN = "UPDATE_ADMIN";
export const GET_ALL_ADMIN = "GET_ALL_ADMIN";
export const GET_ONE_ADMIN = "GET_ONE_ADMIN";
export const DELETE_ADMIN = "DELETE_ADMIN";
export const IP_RESTRICTION = "IP_RESTRICTION";
export const LOGIN_HISTORY = "LOGIN_HISTORY";
export const GET_ALL_MEMBER = "GET_ALL_MEMBER"

const adminLoginAction = (payload) => ({ type: LOGIN_ADMIN, payload });
const adminRegisterAction = (payload) => ({ type: REGISTER_ADMIN, payload });
const adminRequestOTPAction = (payload) => ({
  type: REQUEST_OTP_ADMIN,
  payload,
});
const adminUpdateAction = (payload) => ({ type: UPDATE_ADMIN, payload });
const adminGetAllAction = (payload) => ({ type: GET_ALL_ADMIN, payload });
const adminGetOneAction = (payload) => ({ type: GET_ONE_ADMIN, payload });
const adminDeleteAction = (payload) => ({ type: DELETE_ADMIN, payload });
const ipRestrictionAction = (payload) => ({ type: IP_RESTRICTION, payload });
const adminLoginHistoryAction = (payload) => ({ type: LOGIN_HISTORY, payload });
const memberGetAllAction = (payload) => ({type: GET_ALL_MEMBER, payload})

export const adminLogin = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${adminLoginUrl}`, payload);
      dispatch(adminLoginAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const adminRegister = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(adminRegistrationUrl, payload);
      dispatch(adminRegisterAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const adminRequestOTP = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(adminRequestOTPUrl, payload);
      dispatch(adminRequestOTPAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };
};

export const adminUpdate = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${adminUpdateUrl}/${id}`, payload);
      dispatch(adminUpdateAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const adminGetAll = (page = "", limit = "", search = "", role = "", branchId = "", showAll) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${adminGetAllUrl}?page=${page}&limit=${limit}&search=${search}&role=${role}&branchId=${branchId}&showAll=${showAll}`);
      dispatch(adminGetAllAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const adminGetOne = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${adminGetOneUrl}/${id}`);
      dispatch(adminGetOneAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const adminDelete = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${adminDeleteUrl}/${id}`);
      dispatch(adminDeleteAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const ipRestriction = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${ipRestrictionUrl}`, payload);
      dispatch(ipRestrictionAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
}

export const adminLoginHistory = (page = 1, limit = 10, search = "", role = "", user) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${loginHistoryUrl}?page=${page}&limit=${limit}&search=${search}&role=${role}&user=${user}`);
      dispatch(adminLoginHistoryAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const memberGetAll = (id, roleId) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${memberUrl}/${id}?roleId=${roleId}`);
      dispatch(memberGetAllAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};