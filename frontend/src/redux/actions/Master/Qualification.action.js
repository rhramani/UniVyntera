import Axios from "../../../api.js";
import { createQualificationUrl, deleteQualificationUrl, getAllQualificationUrl, updateQualificationUrl } from "../../routes/Master/Qualification.route";

export const CREATE_QUALIFICATION = "CREATE_QUALIFICATION";
export const UPDATE_QUALIFICATION = "UPDATE_QUALIFICATION";
export const GET_ALL_QUALIFICATION = "GET_ALL_QUALIFICATION";
export const DELETE_QUALIFICATION = "DELETE_QUALIFICATION";

const createQualificationAction = (payload) => ({ type: CREATE_QUALIFICATION, payload });
const updateQualificationAction = (payload) => ({ type: UPDATE_QUALIFICATION, payload });
const getAllQualificationAction = (payload) => ({ type: GET_ALL_QUALIFICATION, payload });
const deleteQualificationAction = (payload) => ({ type: DELETE_QUALIFICATION, payload });

export const createQualification = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createQualificationUrl, payload);
            dispatch(createQualificationAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create qualification:", error);
            throw error;
        }
    }
}

export const updateQualification = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateQualificationUrl}/${id}`, payload);
            dispatch(updateQualificationAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update qualification:", error);
            throw error;
        }
    }
}   

export const getAllQualification = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllQualificationUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllQualificationAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all qualification:", error);
            throw error;
        }
    }
}

export const deleteQualification = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteQualificationUrl}/${id}`);
            dispatch(deleteQualificationAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete qualification:", error);
            throw error;
        }
    }   
}