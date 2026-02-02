import Axios from "../../../api.js";
import { createOtherUrl, deleteOtherUrl, getAllOtherUrl, updateOtherUrl } from "../../routes/Master/OtherService.route.js";

export const CREATE_OTHER = "CREATE_OTHER";
export const UPDATE_OTHER = "UPDATE_OTHER";
export const GET_ALL_OTHER = "GET_ALL_OTHER";
export const DELETE_OTHER = "DELETE_OTHER";

const createOtherAction = (payload) => ({ type: CREATE_OTHER, payload });
const updateOtherAction = (payload) => ({ type: UPDATE_OTHER, payload });
const getAllOtherAction = (payload) => ({ type: GET_ALL_OTHER, payload });
const deleteOtherAction = (payload) => ({ type: DELETE_OTHER, payload });

export const createOther = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createOtherUrl, payload);
            dispatch(createOtherAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create Other:", error);
            throw error;
        }
    }
}

export const updateOther = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateOtherUrl}/${id}`, payload);
            dispatch(updateOtherAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update Other:", error);
            throw error;
        }
    }
}   

export const getAllOther = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllOtherUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllOtherAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all Other:", error);
            throw error;
        }
    }
}

export const deleteOther = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteOtherUrl}/${id}`);
            dispatch(deleteOtherAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete Other:", error);
            throw error;
        }
    }   
}