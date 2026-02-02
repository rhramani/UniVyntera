import Axios from "../../../api.js";
import { createProgramLevelUrl, deleteProgramLevelUrl, getAllProgramLevelUrl, updateProgramLevelUrl } from "../../routes/Master/ProgramLevel.route";

export const CREATE_PROGRAM_LEVEL = "CREATE_PROGRAM_LEVEL"; 
export const UPDATE_PROGRAM_LEVEL = "UPDATE_PROGRAM_LEVEL";
export const GET_ALL_PROGRAM_LEVEL = "GET_ALL_PROGRAM_LEVEL";
export const DELETE_PROGRAM_LEVEL = "DELETE_PROGRAM_LEVEL";

const createProgramLevelAction = (payload) => ({type: CREATE_PROGRAM_LEVEL, payload});
const updateProgramLevelAction = (payload) => ({type: UPDATE_PROGRAM_LEVEL, payload});
const getAllProgramLevelAction = (payload) => ({type: GET_ALL_PROGRAM_LEVEL, payload});
const deleteProgramLevelAction = (payload) => ({type: DELETE_PROGRAM_LEVEL, payload});

export const createProgramLevel = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createProgramLevelUrl, payload);
            dispatch(createProgramLevelAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create program level:", error);
            throw error;
        }
    }
}

export const updateProgramLevel = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateProgramLevelUrl}/${id}`, payload);
            dispatch(updateProgramLevelAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update program level:", error);
            throw error;
        }
    }
}

export const getAllProgramLevel = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllProgramLevelUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllProgramLevelAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all program level:", error);
            throw error;
        }
    }
}

export const deleteProgramLevel = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteProgramLevelUrl}/${id}`);
            dispatch(deleteProgramLevelAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete program level:", error);
            throw error;
        }
    }
}