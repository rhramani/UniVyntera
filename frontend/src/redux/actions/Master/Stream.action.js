import Axios from "../../../api.js";
import { createStreamUrl, deleteStreamUrl, getAllStreamUrl, updateStreamUrl } from "../../routes/Master/Stream.route";

export const CREATE_STREAM = "CREATE_STREAM";
export const UPDATE_STREAM = "UPDATE_STREAM";
export const GET_ALL_STREAM = "GET_ALL_STREAM";
export const DELETE_STREAM = "DELETE_STREAM";

const createStreamAction = (payload) => ({ type: CREATE_STREAM, payload });
const updateStreamAction = (payload) => ({ type: UPDATE_STREAM, payload });
const getAllStreamAction = (payload) => ({ type: GET_ALL_STREAM, payload });
const deleteStreamAction = (payload) => ({ type: DELETE_STREAM, payload });

export const createStream = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createStreamUrl, payload);
            dispatch(createStreamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create stream:", error);
            throw error;
        }
    }
}

export const updateStream = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateStreamUrl}/${id}`, payload);
            dispatch(updateStreamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update stream:", error);
            throw error;
        }
    }
}   

export const getAllStream = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllStreamUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllStreamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all stream:", error);
            throw error;
        }
    }
}

export const deleteStream = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteStreamUrl}/${id}`);
            dispatch(deleteStreamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete stream:", error);
            throw error;
        }
    }   
}