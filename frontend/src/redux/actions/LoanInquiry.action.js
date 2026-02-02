import Axios from "../../api.js";
import {
  createLoanInquiryUrl,
  deleteLoanInquiryUrl,
  getAllLoanInquiryUrl,
  getOneLoanInquiryUrl,
  updateLoanInquiryUrl,
} from "../routes/LoanInquiry.route.js";

export const CREATE_LOAN = "CREATE_LOAN";
export const UPDATE_LOAN = "UPDATE_LOAN";
export const GET_ONE_LOAN = "GET_ONE_LOAN";
export const GET_ALL_LOAN = "GET_ALL_LOAN";
export const DELETE_LOAN = "DELETE_LOAN";

const createLoanAction = (data) => ({ type: CREATE_LOAN, payload: data });
const updateLoanAction = (data) => ({ type: UPDATE_LOAN, payload: data });
const getOneLoanAction = (data) => ({ type: GET_ONE_LOAN, payload: data });
const getAllLoanAction = (data) => ({ type: GET_ALL_LOAN, payload: data });
const deleteLoanAction = (data) => ({ type: DELETE_LOAN, payload: data });

export const createLoan = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createLoanInquiryUrl}`, payload);
      dispatch(createLoanAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const updateLoan = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateLoanInquiryUrl}/${id}`, payload);
      dispatch(updateLoanAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const getOneLoan = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneLoanInquiryUrl}/${id}`);
      dispatch(getOneLoanAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const getAllLoan = (
  page = 1,
  limit = 10,
  search = "",
  startDate = "",
  endDate = "",
  followUpStartDate = "",
  followUpEndDate = "",
) => {
  return async (dispatch) => {
    try {
      let queryString = `${getAllLoanInquiryUrl}?page=${page}&limit=${limit}`;

      if (search) {
        queryString += `&search=${search}`;
      }

      if (startDate) {
        queryString += `&startDate=${startDate}`;
      }

      if (endDate) {
        queryString += `&endDate=${endDate}`;
      }

      if (followUpStartDate) {
        queryString += `&followUpStartDate=${followUpStartDate}`;
      }

      if (followUpEndDate) {
        queryString += `&followUpEndDate=${followUpEndDate}`;
      }

      const res = await Axios.get(queryString);
      dispatch(getAllLoanAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const deleteLoan = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteLoanInquiryUrl}/${id}`);
      dispatch(deleteLoanAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};
