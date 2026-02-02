import Axios from "../../../api.js";
import {
  createExpensesUrl,
  deleteExpensesUrl,
  getAllExpensesUrl,
  getExpensesReportExportUrl,
  updateExpensesUrl,
} from "../../routes/Report/Expenses.route";

export const CREATE_EXPENSES = "CREATE_EXPENSES";
export const UPDATE_EXPENSES = "UPDATE_EXPENSES";
export const GET_ALL_EXPENSES = "GET_ALL_EXPENSES";
export const DELETE_EXPENSES = "DELETE_EXPENSES";
export const EXPENSES_EXPORT_REPORT = "EXPENSES_EXPORT_REPORT";

const createExpensesAction = (data) => ({
  type: CREATE_EXPENSES,
  payload: data,
});

const updateExpensesAction = (data) => ({
  type: UPDATE_EXPENSES,
  payload: data,
});

const getAllExpensesAction = (data) => ({
  type: GET_ALL_EXPENSES,
  payload: data,
});

const deleteExpensesAction = (data) => ({
  type: DELETE_EXPENSES,
  payload: data,
});

const exportExpensesAction = (data) => ({
  type: EXPENSES_EXPORT_REPORT,
  payload: data,
});

export const createExpenses = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createExpensesUrl, payload);
      dispatch(createExpensesAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateExpenses = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateExpensesUrl}/${id}`, payload);
      dispatch(updateExpensesAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllExpenses = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  center = "",
  expenseType= ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllExpensesUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&center=${center}&expenseType=${expenseType}`
      );
      dispatch(getAllExpensesAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteExpenses = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteExpensesUrl}/${id}`);
      dispatch(deleteExpensesAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const exportExpensesReports = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getExpensesReportExportUrl}?ids=${ids}`);
      dispatch(exportExpensesAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};