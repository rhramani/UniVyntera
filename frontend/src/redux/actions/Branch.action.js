import Axios from "../../api.js";
import { createBranchUrl, deleteBranchUrl, getAllBranchUrl, getOneBranchUrl, updateBranchUrl } from "../routes/Branch.route";

export const CREATE_BRANCH = "CREATE_BRANCH";
export const UPDATE_BRANCH = "UPDATE_BRANCH";
export const GET_ONE_BRANCH = "GET_ONE_BRANCH";
export const GET_ALL_BRANCH = "GET_ALL_BRANCH";
export const DELETE_BRANCH = "DELETE_BRANCH";

const createBranchAction = (data) => ({ type: CREATE_BRANCH, payload: data });
const updateBranchAction = (data) => ({ type: UPDATE_BRANCH, payload: data });
const getOneBranchAction = (data) => ({ type: GET_ONE_BRANCH, payload: data });
const getAllBranchAction = (data) => ({ type: GET_ALL_BRANCH, payload: data });
const deleteBranchAction = (data) => ({ type: DELETE_BRANCH, payload: data });

export const createBranch = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(`${createBranchUrl}`, payload);
            dispatch(createBranchAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw error;
        }
    }
};

export const updateBranch = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateBranchUrl}/${id}`, payload);
            dispatch(updateBranchAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw error;
        }
    }
};

export const getOneBranch = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getOneBranchUrl}/${id}`);
            dispatch(getOneBranchAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw error;
        }
    }
};

export const getAllBranch = (page = 1, limit = 10, search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllBranchUrl}?page=${page}&limit=${limit}&search=${search}`);
            dispatch(getAllBranchAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw error;
        }
    }
}

export const deleteBranch = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteBranchUrl}/${id}`);
            dispatch(deleteBranchAction(res.data));
            return res;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw error;
        }
    }
}