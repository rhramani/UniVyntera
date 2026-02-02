import Axios from "../../../api.js";
import { createCountryDocumentUrl, updateCountryDocumentUrl, getAllCountryDocumentUrl, deleteCountryDocumentUrl } from "../../routes/Document/AssignDocument.route";

export const CREATE_COUNTRY_DOCUMENT = "CREATE_COUNTRY_DOCUMENT";
export const UPDATE_COUNTRY_DOCUMENT = "UPDATE_COUNTRY_DOCUMENT";
export const GET_ALL_COUNTRY_DOCUMENT = "GET_ALL_COUNTRY_DOCUMENT";
export const DELETE_COUNTRY_DOCUMENT = "DELETE_COUNTRY_DOCUMENT";

const createCountryDocumentAction = (payload) => ({ type: CREATE_COUNTRY_DOCUMENT, payload });
const updateCountryDocumentAction = (payload) => ({ type: UPDATE_COUNTRY_DOCUMENT, payload });
const getAllCountryDocumentAction = (payload) => ({ type: GET_ALL_COUNTRY_DOCUMENT, payload });
const deleteCountryDocumentAction = (payload) => ({ type: DELETE_COUNTRY_DOCUMENT, payload });

export const createCountryDocument = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createCountryDocumentUrl, payload);
            dispatch(createCountryDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create CountryDocument:", error);
            throw error;
        }
    }
}
export const updateCountryDocument = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateCountryDocumentUrl}/${id}`, payload);
            dispatch(updateCountryDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create CountryDocument:", error);
            throw error;
        }
    }
}
export const getAllCountryDocument = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllCountryDocumentUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllCountryDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create CountryDocument:", error);
            throw error;
        }
    }
}
export const deleteCountryDocument = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteCountryDocumentUrl}/${id}`);
            dispatch(deleteCountryDocumentAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create CountryDocument:", error);
            throw error;
        }
    }
}
