import Axios from "../../../api.js";
import { createWpTemplateUrl, deleteWpTemplateUrl, getAllWpTemplateUrl, getOneWpTemplateUrl, updateWpTemplateUrl } from "../../routes/Whatsapp/WhatsappTemplate.route";

export const CREATE_WP_TEMPLATE = "CREATE_WP_TEMPLATE";
export const UPDATE_WP_TEMPLATE = "UPDATE_WP_TEMPLATE";
export const GET_ONE_WP_TEMPLATE = "GET_ONE_WP_TEMPLATE";
export const GET_ALL_WP_TEMPLATE = "GET_ALL_WP_TEMPLATE";
export const DELETE_WP_TEMPLATE = "DELETE_WP_TEMPLATE";

const createWpTemplateAction = (data) => {
    return {
        type: CREATE_WP_TEMPLATE,
        payload: data,
    };
};

const updateWpTemplateAction = (data) => {
    return {
        type: UPDATE_WP_TEMPLATE,
        payload: data,
    };
};

const getOneWpTemplateAction = (data) => {
    return {
        type: GET_ONE_WP_TEMPLATE,
        payload: data,
    };
};

const getAllWpTemplateAction = (data) => {
    return {
        type: GET_ALL_WP_TEMPLATE,
        payload: data,
    };
};

const deleteWpTemplateAction = (data) => {
    return {
        type: DELETE_WP_TEMPLATE,
        payload: data,
    };
};

export const createWpTemplate = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(`${createWpTemplateUrl}`, payload)
            dispatch(createWpTemplateAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const updateWpTemplate = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateWpTemplateUrl}/${id}`, payload)
            dispatch(updateWpTemplateAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const getOneWpTemplate = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getOneWpTemplateUrl}/${id}`)
            dispatch(getOneWpTemplateAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const getAllWpTemplate = (page = "", limit = "", search = "", category = "") => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllWpTemplateUrl}?page=${page}&limit=${limit}&search=${search}&category=${category}`)
            dispatch(getAllWpTemplateAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}

export const deleteWpTemplate = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteWpTemplateUrl}/${id}`)
            dispatch(deleteWpTemplateAction(res.data));
            return res;
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    };
}