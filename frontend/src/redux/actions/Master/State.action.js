import Axios from "../../../api.js";
import { createStateUrl, deleteStateUrl, getAllStateUrl, stateDropDownUrl, updateStateUrl } from "../../routes/Master/State.route";

export const CREATE_STATE = "CREATE_STATE";
export const UPDATE_STATE = "UPDATE_STATE";
export const GET_ALL_STATE = "GET_ALL_STATE";
export const DELETE_STATE = "DELETE_STATE";
export const STATE_DROPDOWN = "STATE_DROPDOWN";


const createStateAction = (payload) => ({ type: CREATE_STATE, payload });
const updateStateAction = (payload) => ({ type: UPDATE_STATE, payload });
const getAllStateAction = (payload) => ({ type: GET_ALL_STATE, payload });
const deleteStateAction = (payload) => ({ type: DELETE_STATE, payload });
const StateDropdownAction = (payload) => ({ type: STATE_DROPDOWN, payload });


export const createState = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createStateUrl, payload);
            dispatch(createStateAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in creating state:", error);
            throw error;
        }
    }
};

export const updateState = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateStateUrl}/${id}`, payload);
            dispatch(updateStateAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in updating state: ", error);
            throw error;
        }
    }
};

export const getAllState = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllStateUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllStateAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all State: ", error);
            throw error;
        }
    }
};

export const deleteState = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteStateUrl}/${id}`);
            dispatch(deleteStateAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in deleting state: ", error);
            throw error;
        }
    }
};

export const dropdownState = (country) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${stateDropDownUrl}?country=${country}`);
            dispatch(StateDropdownAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in dropdown state: ", error);
            throw error;
        }
    }
};