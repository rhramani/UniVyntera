import Axios from "../../../api.js";
import {
  createBankingDetailUrl,
  deleteBankingDetailUrl,
  getAllBankingDetailUrl,
  updateBankingDetailUrl,
} from "../../routes/Master/Banking.route.js";

export const CREATE_BANKING_DETAILS = "CREATE_BANKING_DETAILS";
export const UPDATE_BANKING_DETAILS = "UPDATE_BANKING_DETAILS";
export const GETALL_BANKING_DETAILS = "GET_ALL_BANKING_DETAILS";
export const DELETE_BANKING_DETAILS = "DELETE_BANKING_DETAILS";

const createBankingDetailsAction = (payload) => ({
  type: CREATE_BANKING_DETAILS,
  payload,
});
const updateBankingDetailsAction = (payload) => ({
  type: UPDATE_BANKING_DETAILS,
  payload,
});
const getAllBankingDetailsAction = (payload) => ({
  type: GETALL_BANKING_DETAILS,
  payload,
});
const deleteBankingDetailsAction = (payload) => ({
  type: DELETE_BANKING_DETAILS,
  payload,
});

export const createBankingDetails = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createBankingDetailUrl, payload);
      dispatch(createBankingDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in create banking details", error);
      throw error;
    }
  };
};

export const updateBankingDetails = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateBankingDetailUrl}/${id}`, payload);
      dispatch(updateBankingDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in update banking details", error);
      throw error;
    }
  };
};

export const getAllBankingDetails = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllBankingDetailUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllBankingDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all banking details", error);
      throw error;
    }
  };
};

export const deleteBankingDetails = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteBankingDetailUrl}/${id}`);
      dispatch(deleteBankingDetailsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in delete banking details", error);
      throw error;
    }
  };
};
