import Axios from "../../api.js";
import { createRolePermissionUrl, getAllRolePermissionUrl, getOneRolePermissionUrl, updateRolePermissionUrl } from "../routes/RolePermission.route";

export const CREATE_ROLE_PERMISSION = "CREATE_ROLE_PERMISSION";
export const UPDATE_ROLE_PERMISSION = "UPDATE_ROLE_PERMISSION";
export const GET_ALL_ROLE_PERMISSION = "GET_ALL_ROLE_PERMISSION";
export const GET_ONE_ROLE_PERMISSION = "GET_ONE_ROLE_PERMISSION";

const createRolePermissionAction = (payload) => ({ type: CREATE_ROLE_PERMISSION, payload });
const updateRolePermissionAction = (payload) => ({ type: UPDATE_ROLE_PERMISSION, payload });
const getAllRolePermissionAction = (payload) => ({ type: GET_ALL_ROLE_PERMISSION, payload });
const getOneRolePermissionAction = (payload) => ({ type: GET_ONE_ROLE_PERMISSION, payload });

export const createRolePermission = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(`${createRolePermissionUrl}`, payload)
            dispatch(createRolePermissionAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}

export const updateRolePermission = (id, payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateRolePermissionUrl}/${id}`, payload)
            dispatch(updateRolePermissionAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}

export const getAllRolePermission = (branchId) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllRolePermissionUrl}?branchId=${branchId}`)
            dispatch(getAllRolePermissionAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}

export const getOneRolePermission = (roleId, branchId) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getOneRolePermissionUrl}/${roleId}?branchId=${branchId}`)
            dispatch(getOneRolePermissionAction(res.data));
            return res;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}