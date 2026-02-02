import Axios from "../../../api";
import {
  addContactUrl,
  bulkImportUrl,
  deleteContactsUrl,
  getAllContactsUrl,
  getAllExportContactsUrl,
  multiDeleteContactUrl,
  unsubscribedContactUrl,
  updateContactUrl,
  getChatContectsUrl,
} from "../../routes/BulkMessage/Contact.route";
import { toast } from "react-toastify";

export const IMPORT_BULK_CONTACT = "IMPORT_BULK_CONTACT";
export const GET_ALL_EXPORTS_CONTACTS = "GET_ALL_EXPORTS_CONTACTS";
export const MULTI_DELETE_CONTACT = "MULTI_DELETE_CONTACT";
export const DELETE_CONTACT = "DELETE_CONTACT";
export const UNSUBSCRIBED_CONATCT = "UNSUBSCRIBED_CONATCT";
export const GET_ALL_CONTACTS = "GET_ALL_CONTACTS";
export const ADD_CONTACT = "ADD_CONTACT";
export const UPDATE_CONTACT = "UPDATE_CONTACT";
export const GET_CHAT_CONTACTS = "GET_CHAT_CONTACTS";

const importBulkContactAction = (data) => ({
  type: IMPORT_BULK_CONTACT,
  payload: data,
});

const getAllExportContactsAction = (data) => ({
  type: GET_ALL_EXPORTS_CONTACTS,
  payload: data,
});

const multiDeleteContactAction = (data) => ({
  type: MULTI_DELETE_CONTACT,
  payload: data,
});

const deleteContactAction = (payload) => ({
  type: DELETE_CONTACT,
  payload: payload,
});

const unsubscribedContactAction = (payload) => ({
  type: UNSUBSCRIBED_CONATCT,
  payload: payload,
});

const getAllContactAction = (payload) => ({
  type: GET_ALL_CONTACTS,
  payload: payload,
});

const addContactAction = (payload) => ({
  type: ADD_CONTACT,
  payload: payload,
});

const updateContactAction = (payload) => ({
  type: UPDATE_CONTACT,
  payload: payload,
});

const getChatContactsAction = (payload) => ({
  type: GET_CHAT_CONTACTS,
  payload: payload,
});

export const bulkImport = (
  file,
  groupId,
  page = 1,
  limit = 10,
  search = ""
) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("excelFile", file); // 👈 backend expects 'file'
      if (groupId) {
        formData.append("groupId", groupId);
      }

      const res = await Axios.post(
        `${bulkImportUrl}?page=${page}&limit=${limit}&search=${search}`,
        formData
      );

      dispatch(importBulkContactAction(res.data));

      return res;
    } catch (error) {
      console.error("Error fetching in bulk import contact", error);
      toast.error(
        error?.response?.data?.message || "Failed to import contacts."
      );
      throw error;
    }
  };
};

export const getAllExportContacts =
  (search = "", subscribed) =>
  async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllExportContactsUrl}?search=${search}&subscribed=${subscribed}`
      );
      dispatch(getAllExportContactsAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAllExportContacts", error);
      throw error;
    }
  };

export const multiDeleteContact = (payload, limits) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(
        `${multiDeleteContactUrl}?limits=${limits}`,
        payload
      );
      dispatch(multiDeleteContactAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in multiDeleteContact", error);
      throw error;
    }
  };
};

export const deleteContact = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteContactsUrl}/${id}`);
      dispatch(deleteContactAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in deleteContact", error);
      throw error;
    }
  };
};

export const unsubscribedContact = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${unsubscribedContactUrl}/${id}`);
      dispatch(unsubscribedContactAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in unsubscribedContact", error);
      throw error;
    }
  };
};

export const getAllContacts =
  ({ page = 1, limit = 10, search = "", subscribed = "" } = {}) =>
  async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllContactsUrl}?page=${page}&limit=${limit}&search=${search}&subscribed=${subscribed}`
      );
      dispatch(getAllContactAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAllContacts", error);
      throw error;
    }
  };

export const addContact = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(addContactUrl, payload);
      dispatch(addContactAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in addContact", error);
      throw error;
    }
  };
};

export const updateContact = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateContactUrl}/${id}`, payload);
      dispatch(updateContactAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in updateContact", error);
      throw error;
    }
  };
};
export const getChatContacts = (limits = {}) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const { search, subscribed } = limits;

      let queryParams = [];

      if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
      if (subscribed === true || subscribed === false) {
        queryParams.push(`subscribed=${subscribed}`);
      }

      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const res = await Axios.get(`${getChatContectsUrl}${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getChatContactsAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getChatContacts:", error);
      throw error;
    }
  };
};
