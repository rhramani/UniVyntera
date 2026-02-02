import Axios from "../../api.js";
import {
  configurationCreateUrl,
  configurationGetAllUrl,
  configurationUpdateUrl,
} from "../routes/Configuration.route.js";

export const CREATE_CONFIGURATION = "CREATE_CONFIGURATION";
export const UPDATE_CONFIGURATION = "UPDATE_CONFIGURATION";
export const GET_ALL_CONFIGURATION = "GET_ALL_CONFIGURATION";

const createConfigurationAction = (data) => ({
  type: CREATE_CONFIGURATION,
  payload: data,
});
const updateConfigurationAction = (data) => ({
  type: UPDATE_CONFIGURATION,
  payload: data,
});
const getAllConfigurationsAction = (data) => ({
  type: GET_ALL_CONFIGURATION,
  payload: data,
});

export const createConfiguration = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${configurationCreateUrl}`, payload);
      dispatch(createConfigurationAction(res.data));
      return res;
    } catch (error) {
      console.error(
        "Create configuration API Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
};

export const updateConfiguration = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${configurationUpdateUrl}/${id}`, payload);
      dispatch(updateConfigurationAction(res.data));
      return res;
    } catch (error) {
      console.error(
        "Update configuration API Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
};

export const getAllConfigurations = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${configurationGetAllUrl}`
      );
      dispatch(getAllConfigurationsAction(res.data));
      return res;
    } catch (error) {
      console.error(
        "Get all configurations API Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
};
