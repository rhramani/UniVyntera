import Axios from "../../api.js";
import { createSettingUrl, deleteSettingUrl, getAllSettingUrl, updateSettingUrl } from "../routes/Setting.route";

export const CREATE_SETTING = "CREATE_SETTING"
export const UPDATE_SETTING = "UPDATE_SETTING"
export const GET_ALL_SETTING = "GET_ALL_SETTING"
export const DELETE_SETTING = "DELETE_SETTING"

const createSettingAction = (payload) => ({ type: CREATE_SETTING, payload });
const updateSettingAction = (payload) => ({ type: UPDATE_SETTING, payload });
const getAllSettingAction = (payload) => ({ type: GET_ALL_SETTING, payload });
const deleteSettingAction = (payload) => ({ type: DELETE_SETTING, payload });


export const createSetting = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(`${createSettingUrl}`, payload)
            dispatch(createSettingAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}
export const updateSetting = (id, payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateSettingUrl}/${id}`, payload)
            dispatch(updateSettingAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}
export const getAllSetting = () => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllSettingUrl}`)
            dispatch(getAllSettingAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}
export const deleteSetting = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteSettingUrl}/${id}`)
            dispatch(deleteSettingAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}