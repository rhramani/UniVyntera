import Axios from "../../../api.js";
import { createExamUrl, deleteExamUrl, getAllExamUrl, updateExamUrl } from "../../routes/Lead/Exam.route";

export const CREATE_EXAM = "CREATE_EXAM";
export const UPDATE_EXAM = "UPDATE_EXAM";
export const GET_ALL_EXAM = "GET_ALL_EXAM";
export const DELETE_EXAM = "DELETE_EXAM";

const createExamAction = (payload) => ({ type: CREATE_EXAM, payload });
const updateExamAction = (payload) => ({ type: UPDATE_EXAM, payload });
const getAllExamAction = (payload) => ({ type: GET_ALL_EXAM, payload });
const deleteExamAction = (payload) => ({ type: DELETE_EXAM, payload });

export const createExam = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createExamUrl, payload);
            dispatch(createExamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create Exam:", error);
            throw error;
        }
    }
}

export const updateExam = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateExamUrl}/${id}`, payload);
            dispatch(updateExamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update Exam:", error);
            throw error;
        }
    }
}   

export const getAllExam = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllExamUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllExamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all Exam:", error);
            throw error;
        }
    }
}

export const deleteExam = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteExamUrl}/${id}`);
            dispatch(deleteExamAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete Exam:", error);
            throw error;
        }
    }   
}