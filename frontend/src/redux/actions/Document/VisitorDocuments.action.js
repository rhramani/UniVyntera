import Axios from "../../../api.js";
import { createVisitorDocumentUrl, deleteVisitorDocumentUrl, getAllVisitorDocumentUrl, updateVisitorDocumentUrl } from "../../routes/Document/VisitorDocuments.route.js";

export const CREATE_VISITOR_DOCUMENT = "CREATE_VISITOR_DOCUMENT";
export const UPDATE_VISITOR_DOCUMENT = "UPDATE_VISITOR_DOCUMENT";
export const GET_ALL_VISITOR_DOCUMENT = "GET_ALL_VISITOR_DOCUMENT";
export const DELETE_VISITOR_DOCUMENT = "DELETE_VISITOR_DOCUMENT";

const createVisitorDocumentAction = (payload) => ({ type: CREATE_VISITOR_DOCUMENT, payload });
const updateVisitorDocumentAction = (payload) => ({ type: UPDATE_VISITOR_DOCUMENT, payload });
const getAllVisitorDocumentAction = (payload) => ({ type: GET_ALL_VISITOR_DOCUMENT, payload });
const deleteVisitorDocumentAction = (payload) => ({ type: DELETE_VISITOR_DOCUMENT, payload });

export const createVisitorDocument = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createVisitorDocumentUrl, payload);
            dispatch(createVisitorDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create VisitorDocument:", error);
            throw error;
        }
    }
}
export const updateVisitorDocument = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateVisitorDocumentUrl}/${id}`, payload);
            dispatch(updateVisitorDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create VisitorDocument:", error);
            throw error;
        }
    }
}
export const getAllVisitorDocument = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllVisitorDocumentUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllVisitorDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create VisitorDocument:", error);
            throw error;
        }
    }
}
export const deleteVisitorDocument = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteVisitorDocumentUrl}/${id}`);
            dispatch(deleteVisitorDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create VisitorDocument:", error);
            throw error;
        }
    }
}
