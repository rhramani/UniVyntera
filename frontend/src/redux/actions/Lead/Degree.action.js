import Axios from "../../../api.js";
import { createDegreeUrl, deleteDegreeUrl, getAllDegreeUrl, updateDegreeUrl } from "../../routes/Lead/Degree.route";

export const CREATE_DEGREE = "CREATE_DEGREE";
export const UPDATE_DEGREE = "UPDATE_DEGREE";
export const GET_ALL_DEGREE = "GET_ALL_DEGREE";
export const DELETE_DEGREE = "DELETE_DEGREE";

const createDegreeAction = (payload) => ({ type: CREATE_DEGREE, payload });
const updateDegreeAction = (payload) => ({ type: UPDATE_DEGREE, payload });
const getAllDegreeAction = (payload) => ({ type: GET_ALL_DEGREE, payload });
const deleteDegreeAction = (payload) => ({ type: DELETE_DEGREE, payload });

export const createDegree = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createDegreeUrl, payload);
            dispatch(createDegreeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create Degree:", error);
            throw error;
        }
    }
}

export const updateDegree = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateDegreeUrl}/${id}`, payload);
            dispatch(updateDegreeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update Degree:", error);
            throw error;
        }
    }
}   

export const getAllDegree = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllDegreeUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllDegreeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all Degree:", error);
            throw error;
        }
    }
}

export const deleteDegree = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteDegreeUrl}/${id}`);
            dispatch(deleteDegreeAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete Exam:", error);
            throw error;
        }
    }   
}