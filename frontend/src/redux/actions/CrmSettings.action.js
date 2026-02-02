import Axios from "../../api.js";
import {
  createCrmSettingsUrl,
  deleteCrmSettingsUrl,
  getAllCrmSettingsUrl,
  updateCrmSettingsUrl,
} from "../routes/CrmSettings.route";

export const CREATE_CRM_SETTINGS = "CREATE_CRM_SETTINGS";
export const UPDATE_CRM_SETTINGS = "UPDATE_CRM_SETTINGS";
export const GET_ALL_CRM_SETTINGS = "GET_ALL_CRM_SETTINGS";
export const DELETE_CRM_SETTINGS = "DELETE_CRM_SETTINGS";

const createCrmSettingsAction = (data) => {
  return {
    type: CREATE_CRM_SETTINGS,
    payload: data,
  };
};

const updateCrmSettingsAction = (data) => {
  return {
    type: UPDATE_CRM_SETTINGS,
    payload: data,
  };
};

const getAllCrmSettingsAction = (data) => {
  return {
    type: GET_ALL_CRM_SETTINGS,
    payload: data,
  };
};

const deleteCrmSettingsAction = (data) => {
  return {
    type: DELETE_CRM_SETTINGS,
    payload: data,
  };
};

export const createCrmSettings = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createCrmSettingsUrl}`, payload);
      dispatch(createCrmSettingsAction(res.data));
      return res;
    } catch (error) {
      console.error("Create crmSettings API Error:", error);
      throw error;
    }
  };
};

export const updateCrmSettings = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCrmSettingsUrl}`, payload);
      dispatch(updateCrmSettingsAction(res.data));
      return res;
    } catch (error) {
      console.error("Update crmSettings API Error:", error);
      throw error;
    }
  };
};

export const getAllCrmSettings = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllCrmSettingsUrl}`);
      dispatch(getAllCrmSettingsAction(res.data));
      return res;
    } catch (error) {
      console.error("Get all crmSettings API Error:", error);
      throw error;
    }
  };
};

export const deleteCrmSettings = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCrmSettingsUrl}/${id}`);
      dispatch(deleteCrmSettingsAction(res.data));
      return res;
    } catch (error) {
      console.error("Delete crmSettings API Error:", error);
      throw error;
    }
  };
};
