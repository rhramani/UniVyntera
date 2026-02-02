import Axios from "../../../api.js";
import { createVisitorDocumentTypeUrl, deleteVisitorDocumentTypeUrl, getAllVisitorDocumentTypeUrl, updateVisitorDocumentTypeUrl } from "../../routes/Document/VisitorDocumentType.route.js";

export const CREATE_VISITOR_DOCUMENT_TYPE = "CREATE_VISITOR_DOCUMENT_TYPE";
export const UPDATE_VISITOR_DOCUMENT_TYPE = "UPDATE_VISITOR_DOCUMENT_TYPE";
export const GET_ALL_VISITOR_DOCUMENT_TYPE = "GET_ALL_VISITOR_DOCUMENT_TYPE";
export const DELETE_VISITOR_DOCUMENT_TYPE = "DELETE_VISITOR_DOCUMENT_TYPE";

const createVisitorDocumentTypeAction = (payload) => ({ type: CREATE_VISITOR_DOCUMENT_TYPE, payload });
const updateVisitorDocumentTypeAction = (payload) => ({ type: UPDATE_VISITOR_DOCUMENT_TYPE, payload });
const getAllVisitorDocumentTypeAction = (payload) => ({ type: GET_ALL_VISITOR_DOCUMENT_TYPE, payload });
const deleteVisitorDocumentTypeAction = (payload) => ({ type: DELETE_VISITOR_DOCUMENT_TYPE, payload });

export const createVisitorDocumentType = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createVisitorDocumentTypeUrl, payload);
            dispatch(createVisitorDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create DocumentType:", error);
            throw error;
        }
    }
}

export const updateVisitorDocumentType = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateVisitorDocumentTypeUrl}/${id}`, payload);
            dispatch(updateVisitorDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update DocumentType:", error);
            throw error;
        }
    }
}   


export const getAllVisitorDocumentType = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllVisitorDocumentTypeUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllVisitorDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all DocumentType:", error);
            throw error;
        }
    }
}

export const deleteVisitorDocumentType = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteVisitorDocumentTypeUrl}/${id}`);
            dispatch(deleteVisitorDocumentTypeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete DocumentType:", error);
            throw error;
        }
    }   
}