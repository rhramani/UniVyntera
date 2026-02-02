import Axios from "../../../api.js";
import {
  createExpenseTypeUrl,
  deleteExpenseTypeUrl,
  getAllExpenseTypeUrl,
  updateExpenseTypeUrl,
} from "../../routes/Master/ExpenseType.route";

export const CREATE_EXPENSE_TYPE = "CREATE_EXPENSE_TYPE";
export const UPDATE_EXPENSE_TYPE = "UPDATE_EXPENSE_TYPE";
export const GET_ALL_EXPENSE_TYPE = "GET_ALL_EXPENSE_TYPE";
export const DELETE_EXPENSE_TYPE = "DELETE_EXPENSE_TYPE";

const createExpenseTypeAction = (data) => ({
  type: CREATE_EXPENSE_TYPE,
  payload: data,
});

const updateExpenseTypeAction = (data) => ({
  type: UPDATE_EXPENSE_TYPE,
  payload: data,
});

const getAllExpenseTypeAction = (data) => ({
  type: GET_ALL_EXPENSE_TYPE,
  payload: data,
});

const deleteExpenseTypeAction = (data) => ({
  type: DELETE_EXPENSE_TYPE,
  payload: data,
});

export const createExpenseType = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createExpenseTypeUrl}`, payload);
      dispatch(createExpenseTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateExpenseType = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateExpenseTypeUrl}/${id}`, payload);
      dispatch(updateExpenseTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
}

export const getAllExpenseType = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllExpenseTypeUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllExpenseTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
}

export const deleteExpenseType = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteExpenseTypeUrl}/${id}`);
      dispatch(deleteExpenseTypeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
}