import { createRequirementUrl, deleteRequirementUrl, getAllRequirementUrl, updateRequirementUrl } from "../../routes/Master/Requirement.route";     
import Axios from "../../../api.js";

export const CREATE_REQUIREMENT = "CREATE_REQUIREMENT";
export const UPDATE_REQUIREMENT = "UPDATE_REQUIREMENT";
export const GET_ALL_REQUIREMENT = "GET_ALL_REQUIREMENT";
export const DELETE_REQUIREMENT = "DELETE_REQUIREMENT";


const createRequirementAction = (payload) => ({type: CREATE_REQUIREMENT, payload});
const updateRequirementAction = (payload) => ({type: UPDATE_REQUIREMENT, payload}); 
const getAllRequirementAction = (payload) => ({type: GET_ALL_REQUIREMENT, payload});
const deleteRequirementAction = (payload) => ({type: DELETE_REQUIREMENT, payload});

export const createRequirement = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createRequirementUrl, payload);
            dispatch(createRequirementAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create requirement:", error);
            throw error;
        }
    }
}

export const updateRequirement = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateRequirementUrl}/${id}`, payload);
            dispatch(updateRequirementAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in update requirement:", error);
            throw error;
        }
    }
}

export const getAllRequirement = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllRequirementUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllRequirementAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in get all requirement:", error);
            throw error;
        }
    }   
}

export const deleteRequirement = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteRequirementUrl}/${id}`);
            dispatch(deleteRequirementAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete requirement:", error);
            throw error;
        }
    }   
}   