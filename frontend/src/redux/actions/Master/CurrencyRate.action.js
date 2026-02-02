import Axios from "../../../api.js";
import {
  bulkUploadCurrencyRateUrl,
  createCurrencyRateUrl,
  deleteCurrencyRateUrl,
  getAllCurrencyRateUrl,
  getOneCurrencyRateUrl,
  updateCurrencyRateUrl,
} from "../../routes/Master/CurrencyRate.route";

export const CREATE_CURRENCY_RATE = "CREATE_CURRENCY_RATE";
export const UPDATE_CURRENCY_RATE = "UPDATE_CURRENCY_RATE";
export const GET_ALL_CURRENCY_RATE = "GET_ALL_CURRENCY_RATE";
export const GET_ONE_CURRENCY_RATE = "GET_ONE_CURRENCY_RATE";
export const DELETE_CURRENCY_RATE = "DELETE_CURRENCY_RATE";
export const BULK_UPLOAD_CURRENCY_RATE = "BULK_UPLOAD_CURRENCY_RATE";

const createCurrencyRateAction = (data) => ({
  type: CREATE_CURRENCY_RATE,
  payload: data,
});

const updateCurrencyRateAction = (data) => ({
  type: UPDATE_CURRENCY_RATE,
  payload: data,
});

const getAllCurrencyRateAction = (data) => ({
  type: GET_ALL_CURRENCY_RATE,
  payload: data,
});
const getOneCurrencyRateAction = (data) => ({
  type: GET_ONE_CURRENCY_RATE,
  payload: data,
});

const deleteCurrencyRateAction = (data) => ({
  type: DELETE_CURRENCY_RATE,
  payload: data,
});
const bulkUploadCurrencyRateAction = (data) => ({
  type: BULK_UPLOAD_CURRENCY_RATE,
  payload: data,
});

export const createCurrencyRate = (data) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createCurrencyRateUrl, data);
      dispatch(createCurrencyRateAction(res.data));
      return res;
    } catch (error) {
      console.error("Error creating visa status:", error);
      throw error;
    }
  };
};

export const updateCurrencyRate = (data, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCurrencyRateUrl}/${id}`, data);
      dispatch(updateCurrencyRateAction(res.data));
      return res;
    } catch (error) {
      console.error("Error updating visa status:", error);
      throw error;
    }
  };
};

export const getAllCurrencyRate = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllCurrencyRateUrl}?search=${search}`);
      dispatch(getAllCurrencyRateAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching all visa statuses:", error);
      throw error;
    }
  };
};
export const getOneCurrencyRate = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneCurrencyRateUrl}/${id}`);
      dispatch(getOneCurrencyRateAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching one visa statuses:", error);
      throw error;
    }
  };
};

export const deleteCurrencyRate = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCurrencyRateUrl}/${id}`);
      dispatch(deleteCurrencyRateAction(res.data));
      return res;
    } catch (error) {
      console.error("Error deleting visa status:", error);
      throw error;
    }
  };
};

export const bulkUploadCurrencyRate = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${bulkUploadCurrencyRateUrl}`, payload);
      dispatch(bulkUploadCurrencyRateAction(res.data));
      return res;
    } catch (error) {
      console.error("Error uploading visa status:", error);
      throw error;
    }
  };
};
