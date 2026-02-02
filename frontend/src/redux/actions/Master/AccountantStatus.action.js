import Axios from "../../../api";
import {
  createAccountantStatusUrl,
  deleteAccountantStatusUrl,
  getAllAccountantStatusUrl,
  updateAccountantStatusUrl,
} from "../../routes/Master/AccountantStatus.route";

export const CREATE_ACCOUNTANT_STATUS = "CREATE_ACCOUNTANT_STATUS";
export const UPDATE_ACCOUNTANT_STATUS = "UPDATE_ACCOUNTANT_STATUS";
export const GET_ALL_ACCOUNTANT_STATUS = "GET_ALL_ACCOUNTANT_STATUS";
export const DELETE_ACCOUNTANT_STATUS = "DELETE_ACCOUNTANT_STATUS";

const createAccountantStatusAction = (data) => ({
  type: CREATE_ACCOUNTANT_STATUS,
  payload: data,
});

const updateAccountantStatusAction = (data) => ({
  type: UPDATE_ACCOUNTANT_STATUS,
  payload: data,
});

const getAllAccountantStatusAction = (data) => ({
  type: GET_ALL_ACCOUNTANT_STATUS,
  payload: data,
});

const deleteAccountantStatusAction = (data) => ({
  type: DELETE_ACCOUNTANT_STATUS,
  payload: data,
});

export const createAccountantStatus = (data) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createAccountantStatusUrl, data);
      dispatch(createAccountantStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error creating visa status:", error);
      throw error;
    }
  };
};

export const updateAccountantStatus = (data, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateAccountantStatusUrl}/${id}`, data);
      dispatch(updateAccountantStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error updating visa status:", error);
      throw error;
    }
  };
};

export const getAllAccountantStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllAccountantStatusUrl}?search=${search}`
      );
      dispatch(getAllAccountantStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching all visa statuses:", error);
      throw error;
    }
  };
};

export const deleteAccountantStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteAccountantStatusUrl}/${id}`);
      dispatch(deleteAccountantStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error deleting visa status:", error);
      throw error;
    }
  };
};
