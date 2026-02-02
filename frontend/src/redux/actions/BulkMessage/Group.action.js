import Axios from "../../../api";
import {
  addBulkContactToGroupUrl,
  addContactToGroupUrl,
  createGroupUrl,
  deleteGroupContactUrl,
  deleteGroupUrl,
  getAllGroupUrl,
  getGroupByIdUrl,
  listGroupContactUrl,
  updateGroupUrl,
} from "../../routes/BulkMessage/Group.route";

export const GET_ALL_GROUPS = "GET_ALL_GROUPS";
export const CREATE_GROUP = "CREATE_GROUP";
export const ADD_CONTACT = "ADD_CONTACT";
export const DELETE_CONTACT = "DELETE_CONTACT";
export const DELETE_GROUP = "DELETE_GROUP";
export const LIST_GROUP_CONTACT = "LIST_GROUP_CONTACT";
export const GET_GROUP_BY_ID = "GET_GROUP_BY_ID ";
export const ADD_BULK_CONTACT = "ADD_BULK_CONTACT";
export const IMPORT_BULK_CONTACT = "IMPORT_BULK_CONTACT";
export const UPDATE_GROUP = "UPDATE_GROUP";
const getAllGroupAction = (payload) => ({
  type: GET_ALL_GROUPS,
  payload: payload,
});
const createGroupAction = (payload) => ({
  type: CREATE_GROUP,
  payload: payload,
});
const addContactAction = (payload) => ({ type: ADD_CONTACT, payload: payload });

const updateGroupAction = (payload) => ({
  type: UPDATE_GROUP,
  payload: payload,
});
const deleteContactAction = (payload) => ({
  type: DELETE_CONTACT,
  payload: payload,
});
const deleteGroupAction = (payload) => ({
  type: DELETE_GROUP,
  payload: payload,
});
const listGroupContactAction = (payload) => ({
  type: LIST_GROUP_CONTACT,
  payload: payload,
});
const getGroupByIdAction = (payload) => ({
  type: GET_GROUP_BY_ID,
  payload: payload,
});
export const importBulkContactAction = (data) => ({
  type: IMPORT_BULK_CONTACT,
  payload: data,
});

export const getAllGroup =
  ({ page = 1, limit = 10, search = "" } = {}) =>
  async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllGroupUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllGroupAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAllGroup", error);
      throw error;
    }
  };

export const createGroup = (payload) => async (dispatch) => {
  try {
    const res = await Axios.post(createGroupUrl, payload);
    dispatch(createGroupAction(res.data));
    return res;
  } catch (error) {
    console.error("Error fetching in createGroup", error);
    throw error;
  }
};

export const updateGroup = (id, payload, params) => async (dispatch) => {
  try {
    const res = await Axios.put(`${updateGroupUrl}/${id}`, payload);
    dispatch(updateGroupAction(res.data));
    
    // Refresh the group list after updating
    if (params) {
      await dispatch(getAllGroup({
        page: params.page || 1,
        limit: params.limit || params.itemsPerPage || 10,
        search: params.search || "",
      }));
    }
    
    return res;
  } catch (error) {
    console.error("Error fetching in updateGroup", error);
    throw error;
  }
};

export const deleteGroupContact = (id, payload) => async (dispatch) => {
  try {
    const res = await Axios.post(`${deleteGroupContactUrl}/${id}`, payload);
    dispatch(deleteContactAction(res.data));
    return res;
  } catch (error) {
    console.error("Error fetching in deleteGroupContact", error);
    throw error;
  }
};

export const addContactToGroup = (groupId, payload) => async (dispatch) => {
  try {
    const res = await Axios.post(`${addContactToGroupUrl}/${groupId}`, payload);
    dispatch(addContactAction(res.data));
    return res;
  } catch (error) {
    console.error("Error fetching in addContactToGroup", error);
    throw error;
  }
};

export const deleteGroup = (id) => async (dispatch) => {
  try {
    const res = await Axios.delete(`${deleteGroupUrl}/${id}`);
    dispatch(deleteGroupAction(res.data));
    return res;
  } catch (error) {
    console.error("Error fetching in deleteGroup", error);
    throw error;
  }
};

export const listGroupContact = (id, page = 1, limit = 10, search = "") => async (dispatch) => {
  try {
    const res = await Axios.get(`${listGroupContactUrl}/${id}?page=${page}&limit=${limit}&search=${search}`);
    dispatch(listGroupContactAction(res.data));
    return res;
  } catch (error) {
    console.error("Error fetching in listGroupContact", error);
    throw error;
  }
};

export const getGroupById = (id) => async (dispatch) => {
  try {
    const res = await Axios.get(`${getGroupByIdUrl}/${id}`);
    dispatch(getGroupByIdAction(res.data));
    return res;
  } catch (error) {
    console.error("Error fetching in getGroupById", error);
    throw error;
  }
};

export const addBulkContactToGroup = (file, groupId) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupId", groupId);
    const res = await Axios.post(`${addBulkContactToGroupUrl}`, formData);
    dispatch(addContactAction(res.data));
    return res;
  } catch (error) {
    console.error("Error fetching in addBulkContactToGroup", error);
    throw error;
  }
};
