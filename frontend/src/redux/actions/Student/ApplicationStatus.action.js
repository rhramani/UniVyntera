import Axios from "../../../api.js";
import { createApplicationStatusUrl, deleteApplicationStatusUrl, getAllApplicationStatusUrl, getOneApplicationStatusUrl, updateApplicationStatusUrl } from "../../routes/Student/ApplicationStatus.route.js";

export const CREATE_APPLICATION_STATUS = "CREATE_APPLICATION_STATUS";
export const UPDATE_APPLICATION_STATUS = "UPDATE_APPLICATION_STATUS";
export const GET_ONE_APPLICATION_STATUS = "GET_ONE_APPLICATION_STATUS";
export const GET_ALL_APPLICATION_STATUS = "GET_ALL_APPLICATION_STATUS";
export const DELETE_APPLICATION_STATUS = "DELETE_APPLICATION_STATUS";

const createApplicationStatusAction = (payload) => ({
  type: CREATE_APPLICATION_STATUS,
  payload,
});

const updateApplicationStatusAction = (payload) => ({
  type: UPDATE_APPLICATION_STATUS,
  payload,
});

const getOneApplicationStatusAction = (payload) => ({
  type: GET_ONE_APPLICATION_STATUS,
  payload,
});

const getAllApplicationStatusAction = (payload) => ({
  type: GET_ALL_APPLICATION_STATUS,
  payload,
});

const deleteApplicationStatusAction = (payload) => ({
  type: DELETE_APPLICATION_STATUS,
  payload,
});

export const createApplicationStatus = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createApplicationStatusUrl, payload);
            dispatch(createApplicationStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create status:", error);
            throw error;
        }
    };
};

export const updateApplicationStatus = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateApplicationStatusUrl}/${id}`, payload);
            dispatch(updateApplicationStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update status:", error);
            throw error;
        }
    };
}

export const getOneApplicationStatus = (mainTab) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getOneApplicationStatusUrl}?mainTab=${mainTab}`);
            dispatch(getOneApplicationStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in getOne status:", error);
            throw error;
        }
    };
}

export const getAllApplicationStatus = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllApplicationStatusUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllApplicationStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in getAll status:", error);
            throw error;
        }
    };
}

export const deleteApplicationStatus = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteApplicationStatusUrl}/${id}`);
            dispatch(deleteApplicationStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete Inquiry:", error);
            throw error;
        }
    };
}