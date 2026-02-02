import Axios from "../../../api.js";
import {
  bulkUploadClientMailUrl,
  createClientMailUrl,
  deleteClientMailUrl,
  getAllClientMailUrl,
  getOneClientMailUrl,
  updateClientMailUrl,
} from "../../routes/Master/ClientMail.route.js";

export const CREATE_CLIENT_MAIL = "CREATE_CLIENT_MAIL";
export const UPDATE_CLIENT_MAIL = "UPDATE_CLIENT_MAIL";
export const GET_ONE_CLIENT_MAIL = "GET_ONE_CLIENT_MAIL";
export const GET_ALL_CLIENT_MAIL = "GET_ALL_CLIENT_MAIL";
export const DELETE_CLIENT_MAIL = "DELETE_CLIENT_MAIL";
export const BULK_UPLOAD_CLIENT_MAIL = "BULK_UPLOAD_CLIENT_MAIL";

const createClientMailAction = (payload) => ({
  type: CREATE_CLIENT_MAIL,
  payload,
});
const updateClientMailAction = (payload) => ({
  type: UPDATE_CLIENT_MAIL,
  payload,
});
const getOneClientMailAction = (payload) => ({
  type: GET_ONE_CLIENT_MAIL,
  payload,
});
const getAllClientMailAction = (payload) => ({
  type: GET_ALL_CLIENT_MAIL,
  payload,
});
const deleteClientMailAction = (payload) => ({
  type: DELETE_CLIENT_MAIL,
  payload,
});
const bulkUploadClientMailAction = (payload) => ({
  type: BULK_UPLOAD_CLIENT_MAIL,
  payload,
});

export const createClientMail = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createClientMailUrl}`, payload);
      dispatch(createClientMailAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create client mail", error);
      throw error;
    }
  };
};

export const updateClientMail = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateClientMailUrl}/${id}`, payload);
      dispatch(updateClientMailAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update client mail", error);
      throw error;
    }
  };
};

export const getOneClientMail = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneClientMailUrl}/${id}`);
      dispatch(getOneClientMailAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in getOne client mail", error);
      throw error;
    }
  };
};

export const getAllClientMail = (page = 1, limit = 10, search = "", category= "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllClientMailUrl}?page=${page}&limit=${limit}&search=${search}&category=${category}`);
      dispatch(getAllClientMailAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in getAll client mail", error);
      throw error;
    }
  };
};

export const deleteClientMail = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteClientMailUrl}/${id}`);
      dispatch(deleteClientMailAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete client mail", error);
      throw error;
    }
  };
};

export const bulkUploadClientMail = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${bulkUploadClientMailUrl}`, payload);
      dispatch(bulkUploadClientMailAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in bulk upload client mail", error);
      throw error;
    }
  };
};
