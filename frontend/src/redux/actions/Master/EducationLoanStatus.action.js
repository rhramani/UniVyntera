import Axios from "../../../api";
import {
  createEducationLoanStatusUrl,
  deleteEducationLoanStatusUrl,
  getAllEducationLoanStatusUrl,
  getOneEducationLoanStatusUrl,
  updateEducationLoanStatusUrl,
} from "../../routes/Master/EducationLoanStatus.route";

export const CREATE_EDUCATION_LOAN_STATUS = "CREATE_EDUCATION_LOAN_STATUS";
export const UPDATE_EDUCATION_LOAN_STATUS = "UPDATE_EDUCATION_LOAN_STATUS";
export const GET_ALL_EDUCATION_LOAN_STATUS = "GET_ALL_EDUCATION_LOAN_STATUS";
export const GET_ONE_EDUCATION_LOAN_STATUS = "GET_ONE_EDUCATION_LOAN_STATUS";
export const DELETE_EDUCATION_LOAN_STATUS = "DELETE_EDUCATION_LOAN_STATUS";

const createLoanStatusAction = (data) => ({
  type: CREATE_EDUCATION_LOAN_STATUS,
  payload: data,
});

const updateLoanStatusAction = (data) => ({
  type: UPDATE_EDUCATION_LOAN_STATUS,
  payload: data,
});

const getAllLoanStatusAction = (data) => ({
  type: GET_ALL_EDUCATION_LOAN_STATUS,
  payload: data,
});

const getOneLoanStatusAction = (data) => ({
  type: GET_ONE_EDUCATION_LOAN_STATUS,
  payload: data,
});

const deleteLoanStatusAction = (data) => ({
  type: DELETE_EDUCATION_LOAN_STATUS,
  payload: data,
});

export const createLoanStatus = (data) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createEducationLoanStatusUrl, data);
      dispatch(createLoanStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error creating Loan status:", error);
      throw error;
    }
  };
};

export const updateLoanStatus = (data, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(
        `${updateEducationLoanStatusUrl}/${id}`,
        data
      );
      dispatch(updateLoanStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error updating Loan status:", error);
      throw error;
    }
  };
};

export const getAllLoanStatus = (search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllEducationLoanStatusUrl}?search=${search}`
      );
      dispatch(getAllLoanStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching all Loan statuses:", error);
      throw error;
    }
  };
};

export const getOneLoanStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneEducationLoanStatusUrl}?id=${id}`);
      dispatch(getOneLoanStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching one Loan statuses:", error);
      throw error;
    }
  };
};

export const deleteLoanStatus = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteEducationLoanStatusUrl}/${id}`);
      dispatch(deleteLoanStatusAction(res.data));
      return res;
    } catch (error) {
      console.error("Error deleting Loan status:", error);
      throw error;
    }
  };
};
