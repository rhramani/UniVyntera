import Axios from "../../../api";
import {
  createVisaStatusUrl,
  deleteVisaStatusUrl,
  getAllVisaStatusUrl,
  getVisaStatusByIdUrl,
  updateVisaStatusUrl,
} from "../../routes/Master/VisaStatus.route";

export const CREATE_VISA_STATUS = "CREATE_VISA_STATUS";
export const UPDATE_VISA_STATUS = "UPDATE_VISA_STATUS";
export const GET_VISA_STATUS_BY_ID = "GET_VISA_STATUS_BY_ID";
export const GET_ALL_VISA_STATUS = "GET_ALL_VISA_STATUS";
export const DELETE_VISA_STATUS = "DELETE_VISA_STATUS";

const createVisaStatusAction = (data) => ({
  type: CREATE_VISA_STATUS,
  payload: data,
});

const updateVisaStatusAction = (data) => ({
  type: UPDATE_VISA_STATUS,
  payload: data,
});

const getVisaStatusByIdAction = (data) => ({
  type: GET_VISA_STATUS_BY_ID,
  payload: data,
});

const getAllVisaStatusAction = (data) => ({
  type: GET_ALL_VISA_STATUS,
  payload: data,
});

const deleteVisaStatusAction = (data) => ({
  type: DELETE_VISA_STATUS,
  payload: data,
});

export const createVisaStatus = (data) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createVisaStatusUrl, data);
      dispatch(createVisaStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error creating visa status:", error);
      throw error;
    }
  };
};

export const updateVisaStatus = (data, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateVisaStatusUrl}/${id}`, data);
      dispatch(updateVisaStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error updating visa status:", error);
      throw error;
    }
  };
};

export const getVisaStatusById = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getVisaStatusByIdUrl}/${id}`);
      dispatch(getVisaStatusByIdAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching visa status by ID:", error);
      throw error;
    }
  };
};

export const getAllVisaStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllVisaStatusUrl}?search=${search}`);
      dispatch(getAllVisaStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching all visa statuses:", error);
      throw error;
    }
  };
};

export const deleteVisaStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteVisaStatusUrl}/${id}`);
      dispatch(deleteVisaStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error deleting visa status:", error);
      throw error;
    }
  };
};
