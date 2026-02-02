import Axios from "../../../api.js";
import { createDocumentListUrl, deleteDocumentListUrl, getAllDocumentListUrl, updateDocumentListUrl } from "../../routes/Document/DocumentList.route";

export const CREATE_DOCUMENT_LIST = "CREATE_DOCUMENT_LIST";
export const UPDATE_DOCUMENT_LIST = "UPDATE_DOCUMENT_LIST";
export const GET_ALL_DOCUMENT_LIST = "GET_ALL__DOCUMENT_LIST";
export const DELETE_DOCUMENT_LIST = "DELETE_DOCUMENT_LIST";

const createDocumentListAction = (payload) => ({ type: CREATE_DOCUMENT_LIST, payload });
const updateDocumentListAction = (payload) => ({ type: UPDATE_DOCUMENT_LIST, payload });
const getAllDocumentListAction = (payload) => ({ type: GET_ALL_DOCUMENT_LIST, payload });
const deleteDocumentListAction = (payload) => ({ type: DELETE_DOCUMENT_LIST, payload });

export const createDocumentList = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createDocumentListUrl, payload);
            dispatch(createDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create DocumentList:", error);
            throw error;
        }
    }
}

export const updateDocumentList = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateDocumentListUrl}/${id}`, payload);
            dispatch(updateDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update DocumentList:", error);
            throw error;
        }
    }
}   

export const getAllDocumentList = (page = 1, limit = 10, search = "", type) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllDocumentListUrl}?page=${page}&limit=${limit}&search=${search}&type=${type}`);
            dispatch(getAllDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all DocumentList:", error);
            throw error;
        }
    }
}

export const deleteDocumentList = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteDocumentListUrl}/${id}`);
            dispatch(deleteDocumentListAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete DocumentList:", error);
            throw error;
        }
    }   
}