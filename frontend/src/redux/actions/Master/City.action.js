import Axios from "../../../api.js";
import { cityDropDownUrl, createCityUrl, deleteCityUrl, getAllCityUrl, updateCityUrl } from "../../routes/Master/City.route";

export const CREATE_CITY = "CREATE_CITY";
export const UPDATE_CITY = "UPDATE_CITY";
export const GET_ALL_CITY = "GET_ALL_CITY";
export const DELETE_CITY = "DELETE_CITY";
export const CITY_DROPDOWN = "CITY_DROPDOWN";

const createCityAction = (payload) => ({ type: CREATE_CITY, payload });
const updateCityAction = (payload) => ({ type: UPDATE_CITY, payload });
const getAllCityAction = (payload) => ({ type: GET_ALL_CITY, payload });
const deleteCityAction = (payload) => ({ type: DELETE_CITY, payload });
const cityDropDownAction = (payload) => ({ type: CITY_DROPDOWN, payload });

export const createCity = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createCityUrl, payload);
            dispatch(createCityAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}

export const updateCity = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateCityUrl}/${id}`, payload);    
            dispatch(updateCityAction(res.data));
            return res;
        } catch (error) {    
            console.error("API Error:", error);
            throw error;
        }
    }
}

export const getAllCity = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllCityUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllCityAction(res.data));
            return res;
        } catch (error) {    
            console.error("API Error:", error);
            throw error;
        }
    }
}

export const deleteCity = (id) => {    
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteCityUrl}/${id}`);
            dispatch(deleteCityAction(res.data));
            return res;
        } catch (error) {    
            console.error("API Error:", error);
            throw error;
        }
    }
}

export const cityDropDown = (country, state) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${cityDropDownUrl}?country=${country}&state=${state}`);
            dispatch(cityDropDownAction(res.data));
            return res;
        } catch (error) {    
            console.error("API Error:", error);
            throw error;
        }
    }
}