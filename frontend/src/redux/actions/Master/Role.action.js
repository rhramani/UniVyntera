import Axios from "../../../api.js";
import {
  createRoleUrl,
  deleteRoleUrl,
  getAllRoleUrl,
  getAllRoleUrlWithoutPagination,
  getOneRoleUrl,
  updateRoleUrl,
} from "../../routes/Master/Role.route.js";

export const CREATE_ROLE = "CREATE_ROLE";
export const UPDATE_ROLE = "UPDATE_ROLE";
export const GET_ONE_ROLE = "GET_ONE_ROLE";
export const GET_ALL_ROLE = "GET_ALL_ROLE";
export const DELETE_ROLE = "DELETE_ROLE";
export const GET_ALL_ROLE_LIST = "GET_ALL_ROLE_LIST";

const createRoleAction = (payload) => ({ type: CREATE_ROLE, payload });
const updateRoleAction = (payload) => ({ type: UPDATE_ROLE, payload });
const getOneRoleAction = (payload) => ({ type: GET_ONE_ROLE, payload });
const getAllRoleAction = (payload) => ({ type: GET_ALL_ROLE, payload });
const deleteRoleAction = (payload) => ({ type: DELETE_ROLE, payload });
const getAllRoleListAction = (payload) => ({
  type: GET_ALL_ROLE_LIST,
  payload,
});

export const createRole = (payload, branchId) => {
  return async (dispatch) => {
    try {
      // Pass branchId in query parameters
      const res = await Axios.post(
        `${createRoleUrl}${branchId ? `?branchId=${branchId}` : ""}`,
        payload
      );
      dispatch(createRoleAction(res.data));
      return res;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  };
};

export const updateRole = (payload, id, branchId) => {
  return async (dispatch) => {
    try {
      // Pass id in query parameters
      const res = await Axios.put(
        `${updateRoleUrl}/${id}?${branchId ? `?branchId=${branchId}` : ""}`,
        payload
      );
      dispatch(updateRoleAction(res.data));
      return res;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  };
};

export const getOneRole = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneRoleUrl}/${id}`);
      dispatch(getOneRoleAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching one role:", error);
      throw error;
    }
  };
};

export const getAllRole = (
  page = "",
  limit = "",
  search = "",
  branchId = "",
  showAll
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllRoleUrl}?page=${page}&limit=${limit}&search=${search}&branchId=${branchId}&showAll=${showAll}`
      );
      dispatch(getAllRoleAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching all roles:", error);
      throw error;
    }
  };
};

export const getAllRoleList = (branchId, showAll) => {
  return async (dispatch) => {
    try {   
      const res = await Axios.get(`${getAllRoleUrlWithoutPagination}?branchId=${branchId}&showAll=${showAll}`);
      dispatch(getAllRoleListAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching all roles list:", error);
      throw error;
    }
  };
};

export const deleteRole = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteRoleUrl}/${id}`);
      dispatch(deleteRoleAction(res.data));
      return res;
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  };
};