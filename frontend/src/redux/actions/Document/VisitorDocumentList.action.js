import Axios from "../../../api.js";
import { createVisitorDocumentListUrl, deleteVisitorDocumentListUrl, getAllVisitorDocumentListUrl, updateVisitorDocumentListUrl } from "../../routes/Document/VisitorDocumentList.route.js";

export const CREATE_VISITOR_DOCUMENT_LIST = "CREATE_VISITOR_DOCUMENT_LIST";
export const UPDATE_VISITOR_DOCUMENT_LIST = "UPDATE_VISITOR_DOCUMENT_LIST";
export const GET_ALL_VISITOR_DOCUMENT_LIST = "GET_ALL_VISITOR_DOCUMENT_LIST";
export const DELETE_VISITOR_DOCUMENT_LIST = "DELETE_VISITOR_DOCUMENT_LIST";

const createVisitorDocumentListAction = (payload) => ({ type: CREATE_VISITOR_DOCUMENT_LIST, payload });
const updateVisitorDocumentListAction = (payload) => ({ type: UPDATE_VISITOR_DOCUMENT_LIST, payload });
const getAllVisitorDocumentListAction = (payload) => ({ type: GET_ALL_VISITOR_DOCUMENT_LIST, payload });
const deleteVisitorDocumentListAction = (payload) => ({ type: DELETE_VISITOR_DOCUMENT_LIST, payload });

export const createVisitorDocumentList = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createVisitorDocumentListUrl, payload);
            dispatch(createVisitorDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create DocumentList:", error);
            throw error;
        }
    }
}

export const updateVisitorDocumentList = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateVisitorDocumentListUrl}/${id}`, payload);
            dispatch(updateDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update DocumentList:", error);
            throw error;
        }
    }
}   

export const getAllVisitorDocumentList = (page = 1, limit = 10, search = "", type) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllVisitorDocumentListUrl}?page=${page}&limit=${limit}&search=${search}&type=${type}`);
            dispatch(getAllVisitorDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all DocumentList:", error);
            throw error;
        }
    }
}

export const deleteVisitorDocumentList = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteVisitorDocumentListUrl}/${id}`);
            dispatch(deleteVisitorDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete DocumentList:", error);
            throw error;
        }
    }   
}