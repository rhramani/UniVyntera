import Axios from "../../../../api.js";
import { createLeadSubStatusUrl, deleteLeadSubStatusUrl, getAllLeadSubStatusUrl, getOneLeadSubStatusUrl, updateLeadSubStatusUrl } from "../../../routes/Master/LeadStatuses/LeadSubStatus.route.js";

export const CREATE_LEAD_SUB_STATUS = "CREATE_LEAD_SUB_STATUS";
export const UPDATE_LEAD_SUB_STATUS = "UPDATE_LEAD_SUB_STATUS";
export const GET_ONE_LEAD_SUB_STATUS = "GET_ONE_LEAD_SUB_STATUS";
export const GET_ALL_LEAD_SUB_STATUS = "GET_ALL_LEAD_SUB_STATUS";
export const DELETE_LEAD_SUB_STATUS = "DELETE_LEAD_SUB_STATUS";

const createLeadSubStatusAction = (payload) => ({
  type: CREATE_LEAD_SUB_STATUS,
  payload,
});

const updateLeadSubStatusAction = (payload) => ({
  type: UPDATE_LEAD_SUB_STATUS,
  payload,
});

const getOneLeadSubStatusAction = (payload) => ({
  type: GET_ONE_LEAD_SUB_STATUS,
  payload,
});

const getAllLeadSubStatusAction = (payload) => ({
  type: GET_ALL_LEAD_SUB_STATUS,
  payload,
});

const deleteLeadSubStatusAction = (payload) => ({
  type: DELETE_LEAD_SUB_STATUS,
  payload,
});

export const createLeadSubStatus = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createLeadSubStatusUrl, payload);
            dispatch(createLeadSubStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create status:", error);
            throw error;
        }
    };
};

export const updateLeadSubStatus = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateLeadSubStatusUrl}/${id}`, payload);
            dispatch(updateLeadSubStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update status:", error);
            throw error;
        }
    };
}

export const getOneLeadSubStatus = (mainTab) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getOneLeadSubStatusUrl}?mainTab=${mainTab}`);
            dispatch(getOneLeadSubStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in getOne status:", error);
            throw error;
        }
    };
}

export const getAllLeadSubStatus = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllLeadSubStatusUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllLeadSubStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in getAll status:", error);
            throw error;
        }
    };
}

export const deleteLeadSubStatus = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteLeadSubStatusUrl}/${id}`);
            dispatch(deleteLeadSubStatusAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete Inquiry:", error);
            throw error;
        }
    };
}