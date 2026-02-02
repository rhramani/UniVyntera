import Axios from "../../../api.js";
import { createIntakeUrl, deleteIntakeUrl, getAllIntakeUrl, updateIntakeUrl } from "../../routes/Master/Intake.route";


export const CREATE_INTAKE = "CREATE_INTAKE";
export const UPDATE_INTAKE = "UPDATE_INTAKE";
export const GET_ALL_INTAKE = "GET_ALL_INTAKE";
export const DELETE_INTAKE = "DELETE_INTAKE";

const createIntakeAction = (payload) => ({ type: CREATE_INTAKE, payload });
const updateIntakeAction = (payload) => ({ type: UPDATE_INTAKE, payload });
const getAllIntakeAction = (payload) => ({ type: GET_ALL_INTAKE, payload });
const deleteIntakeAction = (payload) => ({ type: DELETE_INTAKE, payload });

export const createIntake = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createIntakeUrl, payload);
            dispatch(createIntakeAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    };
};

export const updateIntake = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateIntakeUrl}/${id}`, payload);
            dispatch(updateIntakeAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    };
};

export const getAllIntake = (page = 1, limit = 10) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllIntakeUrl}?page=${page}&limit=${limit}`);
            dispatch(getAllIntakeAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    };
};  

export const deleteIntake = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteIntakeUrl}/${id}`);
            dispatch(deleteIntakeAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    };
}