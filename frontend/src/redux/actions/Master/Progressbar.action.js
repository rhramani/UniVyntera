import Axios from "../../../api.js";
import { createProgessbarUrl, deleteProgessbarUrl, getAllProgessbarUrl } from "../../routes/Master/Progressbar.route";

export const CREATE_PROGRESSBAR = "CREATE_PROGRESSBAR";
export const GET_ALL_PROGRESSBAR = "GET_ALL_PROGRESSBAR";
export const DELETE_PROGRESSBAR = "DELETE_PROGRESSBAR";

const createProgressbarAction = (payload) => ({type: CREATE_PROGRESSBAR, payload});
const getAllProgressbarAction = (payload) => ({type: GET_ALL_PROGRESSBAR, payload});
const deleteProgressbarAction = (payload) => ({type: DELETE_PROGRESSBAR, payload});

export const createProgressbar = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(createProgessbarUrl, payload);
            dispatch(createProgressbarAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in create progress bar");
            throw error;
        }
    };
};

export const getAllProgressbar = (page = 1, limit = 10, search = "", country) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllProgessbarUrl}?page=${page}&limit=${limit}&search=${search}&country=${country}`);
            dispatch(getAllProgressbarAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in getAll progress bar");
            throw error;
        }
    };
};

export const deleteProgressbar = (id) => {
    console.log("deleteProgressbar>>>>>", id);
    
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteProgessbarUrl}/${id}`);
            dispatch(deleteProgressbarAction(res.data));
            return res;
        } catch (error) {
            console.error("Error fetching in delete progress bar");
            throw error;
        }
    };
};