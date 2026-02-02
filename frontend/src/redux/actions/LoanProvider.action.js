import Axios from "../../api.js";
import {
  createLoanProviderUrl,
  updateLoanProviderUrl,
  getOneLoanProviderUrl,
  getAllLoanProviderUrl,
  deleteLoanProviderUrl,
} from "../routes/Master/LoanProvider.route";

export const CREATE_LOAN_PROVIDER = "CREATE_LOAN_PROVIDER";
export const UPDATE_LOAN_PROVIDER = "UPDATE_LOAN_PROVIDER";
export const GET_ONE_LOAN_PROVIDER = "GET_ONE_LOAN_PROVIDER";
export const GET_ALL_LOAN_PROVIDER = "GET_ALL_LOAN_PROVIDER";
export const DELETE_LOAN_PROVIDER = "DELETE_LOAN_PROVIDER";

const createLoanProviderAction = (payload) => ({
  type: CREATE_LOAN_PROVIDER,
  payload,
});

const updateLoanProviderAction = (payload) => ({
  type: UPDATE_LOAN_PROVIDER,
  payload,
});

const getOneLoanProviderAction = (payload) => ({
  type: GET_ONE_LOAN_PROVIDER,
  payload,
});

const getAllLoanProviderAction = (payload) => ({
  type: GET_ALL_LOAN_PROVIDER,
  payload,
});

const deleteLoanProviderAction = (payload) => ({
  type: DELETE_LOAN_PROVIDER,
  payload,
});

export const createLoanProvider = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createLoanProviderUrl, payload);
      dispatch(createLoanProviderAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create loan provider:", error);
      throw error;
    }
  };
};

export const updateLoanProvider = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateLoanProviderUrl}/${id}`, payload);
      dispatch(updateLoanProviderAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update loan provider:", error);
      throw error;
    }
  };
};

export const getOneLoanProvider = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneLoanProviderUrl}/${id}`);
      dispatch(getOneLoanProviderAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get one loan provider:", error);
      throw error;
    }
  };
};

export const getAllLoanProvider = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllLoanProviderUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllLoanProviderAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all loan provider:", error);
      throw error;
    }
  };
};

export const deleteLoanProvider = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteLoanProviderUrl}/${id}`);
      dispatch(deleteLoanProviderAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete loan provider:", error);
      throw error;
    }
  };
};
