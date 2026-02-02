import Axios from "../../api.js";
import {
  b2bAdminCountryListUrl,
  b2bAdminCreateUrl,
  b2bAdminDeleteUrl,
  b2bAdminGetAllUrl,
  b2bAdminGetOneUrl,
  b2bAdminUpdateUrl,
  b2bBulkUploadUrl,
  b2bAdminDownloadUrl,
} from "../routes/B2BAdmin.route";

export const CREATE_B2B_ADMIN = "CREATE_B2B_ADMIN";
export const UPDATE_B2B_ADMIN = "UPDATE_B2B_ADMIN";
export const GET_ALL_B2B_ADMIN = "GET_ALL_B2B_ADMIN";
export const DELETE_B2B_ADMIN = "DELETE_B2B_ADMIN";
export const GET_ONE_B2B_ADMIN = "GET_ONE_B2B_ADMIN";
export const GET_COUNTRY_LIST_B2B_ADMIN = "GET_COUNTRY_LIST_B2B_ADMIN";
export const UPLOAD_B2B_BULK_UPLOAD = "UPLOAD_B2B_BULK_UPLOAD";
export const DOWNLOAD_B2B_ADMIN = "DOWNLOAD_B2B_ADMIN";

const createB2BAdminAction = (payload) => ({ type: CREATE_B2B_ADMIN, payload });
const updateB2BAdminAction = (payload) => ({ type: UPDATE_B2B_ADMIN, payload });
const getAllB2BAdminAction = (payload) => ({
  type: GET_ALL_B2B_ADMIN,
  payload,
});
const deleteB2BAdminAction = (payload) => ({ type: DELETE_B2B_ADMIN, payload });
const getOneB2BAdminAction = (payload) => ({
  type: GET_ONE_B2B_ADMIN,
  payload,
});
const getCountryListAdminAction = (payload) => ({
  type: GET_COUNTRY_LIST_B2B_ADMIN,
  payload,
});
const uploadB2bBulkUploadAction = (payload) => ({
  type: UPLOAD_B2B_BULK_UPLOAD,
  payload,
});
const downloadB2bAdminAction = (payload) => ({
  type: DOWNLOAD_B2B_ADMIN,
  payload,
});

export const createB2BAdmin = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${b2bAdminCreateUrl}`, payload);
      dispatch(createB2BAdminAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateB2BAdmin = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${b2bAdminUpdateUrl}/${id}`, payload);
      dispatch(updateB2BAdminAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllB2BAdmin = (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  country = "",
  subscription = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${b2bAdminGetAllUrl}?page=${page}&limit=${limit}&search=${search}&status=${status}&country=${country}&subscription=${subscription}`
      );
      dispatch(getAllB2BAdminAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getOneB2BAdmin = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${b2bAdminGetOneUrl}/${id}`);
      dispatch(getOneB2BAdminAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteB2BAdmin = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${b2bAdminDeleteUrl}/${id}`);
      dispatch(deleteB2BAdminAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const b2bAdminCountryList = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${b2bAdminCountryListUrl}`);
      dispatch(getCountryListAdminAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const b2bBulkUpload = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${b2bBulkUploadUrl}`, payload);
      dispatch(uploadB2bBulkUploadAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const downloadB2bAdmin = (
  search = "",
  status = "",
  country = "",
  subscription = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${b2bAdminDownloadUrl}?search=${search}&status=${status}&country=${country}&subscription=${subscription}`
      );
      dispatch(downloadB2bAdminAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
