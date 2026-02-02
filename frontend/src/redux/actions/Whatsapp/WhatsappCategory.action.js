import Axios from "../../../api.js";
import { cretaeWpCategoryUrl, deleteWpCategoryUrl, getAllWpCategoryUrl, getOneWpCategoryUrl, updateWpCategoryUrl } from "../../routes/Whatsapp/WhatsappCategory.route";

export const CREATE_WP_CATEGORY = "CREATE_WP_CATEGORY";
export const UPDATE_WP_CATEGORY = "UPDATE_WP_CATEGORY";
export const GET_ONE_WP_CATEGORY = "GET_ONE_WP_CATEGORY";
export const GET_ALL_WP_CATEGORY = "GET_ALL_WP_CATEGORY";
export const DELETE_WP_CATEGORY = "DELETE_WP_CATEGORY";

const createWpCategoryAction = (data) => {
    return {
        type: CREATE_WP_CATEGORY,
        payload: data,
    };
};

const updateWpCategoryAction = (data) => {
    return {
        type: UPDATE_WP_CATEGORY,
        payload: data,
    };
};

const getOneWpCategoryAction = (data) => {
    return {
        type: GET_ONE_WP_CATEGORY,
        payload: data,
    };
};

const getAllWpCategoryAction = (data) => {
    return {
        type: GET_ALL_WP_CATEGORY,
        payload: data,
    };
};

const deleteWpCategoryAction = (data) => {
    return {
        type: DELETE_WP_CATEGORY,
        payload: data,
    };
};

export const createWpCategory = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(`${cretaeWpCategoryUrl}`, payload)
            dispatch(createWpCategoryAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const updateWpCategory = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateWpCategoryUrl}/${id}`, payload)
            dispatch(updateWpCategoryAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const getOneWpCategory = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getOneWpCategoryUrl}/${id}`)
            dispatch(getOneWpCategoryAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const getAllWpCategory = (page = "", limit = "", search = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllWpCategoryUrl}?page=${page}&limit=${limit}&search=${search}`)
            dispatch(getAllWpCategoryAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const deleteWpCategory = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteWpCategoryUrl}/${id}`)
            dispatch(deleteWpCategoryAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}