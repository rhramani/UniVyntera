import Axios from "../../../api.js";
import { countryDropDownUrl, createCountryUrl, deleteCountryUrl, getAllCountryUrl, updateCountryUrl } from "../../routes/Master/Country.route";

export const CREATE_COUNTRY = "CREATE_COUNTRY";
export const UPDATE_COUNTRY = "UPDATE_COUNTRY";
export const GET_ALL_COUNTRY = "GET_ALL_COUNTRY";
export const DELETE_COUNTRY = "DELETE_COUNTRY";
export const COUNTRY_DROPDOWN = "COUNTRY_DROPDOWN";


const createCountryAction = (payload) => ({ type: CREATE_COUNTRY, payload });
const updateCountryAction = (payload) => ({ type: UPDATE_COUNTRY, payload });
const getAllCountryAction = (payload) => ({ type: GET_ALL_COUNTRY, payload });
const deleteCountryAction = (payload) => ({ type: DELETE_COUNTRY, payload });
const countryDropdownAction = (payload) => ({ type: COUNTRY_DROPDOWN, payload });


export const createCountry = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createCountryUrl, payload);
            dispatch(createCountryAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}

export const updateCountry = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateCountryUrl}/${id}`, payload);
            dispatch(updateCountryAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}   

export const getAllCountry = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllCountryUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllCountryAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}

export const deleteCountry = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteCountryUrl}/${id}`);
            dispatch(deleteCountryAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }   
}

export const countryDropDown = () => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(countryDropDownUrl);
            dispatch(countryDropdownAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}