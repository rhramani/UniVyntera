import Axios from "../../../api.js";
import { createDocumentTypeUrl, deleteDocumentTypeUrl, getAllDocumentTypeUrl, updateDocumentTypeUrl } from "../../routes/Document/DocumentType.route";

export const CREATE_DOCUMENT_TYPE = "CREATE_DOCUMENT_TYPE";
export const UPDATE_DOCUMENT_TYPE = "UPDATE_DOCUMENT_TYPE";
export const GET_ALL_DOCUMENT_TYPE = "GET_ALL__DOCUMENT_TYPE";
export const DELETE_DOCUMENT_TYPE = "DELETE_DOCUMENT_TYPE";

const createDocumentTypeAction = (payload) => ({ type: CREATE_DOCUMENT_TYPE, payload });
const updateDocumentTypeAction = (payload) => ({ type: UPDATE_DOCUMENT_TYPE, payload });
const getAllDocumentTypeAction = (payload) => ({ type: GET_ALL_DOCUMENT_TYPE, payload });
const deleteDocumentTypeAction = (payload) => ({ type: DELETE_DOCUMENT_TYPE, payload });

export const createDocumentType = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createDocumentTypeUrl, payload);
            dispatch(createDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create DocumentType:", error);
            throw error;
        }
    }
}

export const updateDocumentType = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateDocumentTypeUrl}/${id}`, payload);
            dispatch(updateDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update DocumentType:", error);
            throw error;
        }
    }
}   


export const getAllDocumentType = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllDocumentTypeUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all DocumentType:", error);
            throw error;
        }
    }
}

export const deleteDocumentType = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteDocumentTypeUrl}/${id}`);
            dispatch(deleteDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete DocumentType:", error);
            throw error;
        }
    }   
}