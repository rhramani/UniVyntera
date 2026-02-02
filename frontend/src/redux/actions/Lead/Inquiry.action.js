import Axios from "../../../api.js";
import { createInquiryUrl, deleteInquiryUrl, getAllInquiryUrl, updateInquiryUrl } from "../../routes/Lead/Inquiry.route";

export const CREATE_INQUIRY = "CREATE_INQUIRY";
export const UPDATE_INQUIRY = "UPDATE_INQUIRY";
export const GET_ALL_INQUIRY = "GET_ALL_INQUIRY";
export const DELETE_INQUIRY = "DELETE_INQUIRY";

const createInquiryAction = (payload) => ({ type: CREATE_INQUIRY, payload });
const updateInquiryAction = (payload) => ({ type: UPDATE_INQUIRY, payload });
const getAllInquiryAction = (payload) => ({ type: GET_ALL_INQUIRY, payload });
const deleteInquiryAction = (payload) => ({ type: DELETE_INQUIRY, payload });

export const createInquiry = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createInquiryUrl, payload);
            dispatch(createInquiryAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create Inquiry:", error);
            throw error;
        }
    }
}

export const updateInquiry = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateInquiryUrl}/${id}`, payload);
            dispatch(updateInquiryAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update Inquiry:", error);
            throw error;
        }
    }
}   

export const getAllInquiry = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllInquiryUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllInquiryAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all Inquiry:", error);
            throw error;
        }
    }
}

export const deleteInquiry = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteInquiryUrl}/${id}`);
            dispatch(deleteInquiryAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete Inquiry:", error);
            throw error;
        }
    }   
}