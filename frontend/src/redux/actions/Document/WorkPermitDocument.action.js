import Axios from "../../../api.js";
import { createWorkPermitDocumentUrl, deleteWorkPermitDocumentUrl, getAllWorkPermitDocumentUrl, updateWorkPermitDocumentUrl } from "../../routes/Document/WorkPermitDocument.route.js";

export const CREATE_WORK_PERMIT_DOCUMENT = "CREATE_WORK_PERMIT_DOCUMENT";
export const UPDATE_WORK_PERMIT_DOCUMENT = "UPDATE_WORK_PERMIT_DOCUMENT";
export const GET_ALL_WORK_PERMIT_DOCUMENT = "GET_ALL_WORK_PERMIT_DOCUMENT";
export const DELETE_WORK_PERMIT_DOCUMENT = "DELETE_WORK_PERMIT_DOCUMENT";

const createWorkPermitDocumentAction = (payload) => ({ type: CREATE_WORK_PERMIT_DOCUMENT, payload });
const updateWorkPermitDocumentAction = (payload) => ({ type: UPDATE_WORK_PERMIT_DOCUMENT, payload });
const getAllWorkPermitDocumentAction = (payload) => ({ type: GET_ALL_WORK_PERMIT_DOCUMENT, payload });
const deleteWorkPermitDocumentAction = (payload) => ({ type: DELETE_WORK_PERMIT_DOCUMENT, payload });

export const createWorkPermitDocument = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createWorkPermitDocumentUrl, payload);
            dispatch(createWorkPermitDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create WorkPermitDocument:", error);
            throw error;
        }
    }
}
export const updateWorkPermitDocument = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateWorkPermitDocumentUrl}/${id}`, payload);
            dispatch(updateWorkPermitDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create WorkPermitDocument:", error);
            throw error;
        }
    }
}
export const getAllWorkPermitDocument = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllWorkPermitDocumentUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllWorkPermitDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create WorkPermitDocument:", error);
            throw error;
        }
    }
}
export const deleteWorkPermitDocument = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteWorkPermitDocumentUrl}/${id}`);
            dispatch(deleteWorkPermitDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create WorkPermitDocument:", error);
            throw error;
        }
    }
}
