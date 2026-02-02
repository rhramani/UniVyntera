import Axios from "../../../api.js";
import {
  createTransferCreateUrl,
  generateInvoiceCreateUrl,
  generateInvoiceDeleteUrl,
  generateInvoiceExportReportUrl,
  generateInvoiceGetAllUrl,
  generateInvoiceUpdateUrl,
  getAllTotalBankCashUrl,
  uniqueStudentUrl,
  getFundTransferHistoryUrl,
} from "../../routes/Accountant/GenerateInvoice.routes";

export const CREATE_GENERATE_INVOICE = "CREATE_GENERATE_INVOICE";
export const UPDATE_GENERATE_INVOICE = "UPDATE_GENERATE_INVOICE";
export const DELETE_GENERATE_INVOICE = "DELETE_GENERATE_INVOICE";
export const GET_ALL_GENERATE_INVOICE = "GET_ALL_GENERATE_INVOICE";
export const UNIQUE_STUDENT = "UNIQUE_STUDENT";
export const EXPORT_REPORT_GENERATE_INVOICE = "EXPORT_REPORT_GENERATE_INVOICE";
export const GET_ALL_TOTAL_BANK_CASH = "GET_ALL_TOTAL_BANK_CASH";
export const CREATE_TRANSFER = "CREATE_TRANSFER";
export const GET_FUND_TRANSFER_HISTORY = "GET_FUND_TRANSFER_HISTORY";

const createGenerateInvoiceAction = (payload) => ({
  type: CREATE_GENERATE_INVOICE,
  payload,
});
const updateGenerateInvoiceAction = (payload) => ({
  type: UPDATE_GENERATE_INVOICE,
  payload,
});
const deleteGenerateInvoiceAction = (payload) => ({
  type: DELETE_GENERATE_INVOICE,
  payload,
});

const getAllGenerateInvoiceAction = (payload) => ({
  type: GET_ALL_GENERATE_INVOICE,
  payload,
});

const uniqueStudentAction = (payload) => ({
  type: UNIQUE_STUDENT,
  payload,
});

const exportReportGenerateInvoiceAction = (payload) => ({
  type: EXPORT_REPORT_GENERATE_INVOICE,
  payload,
});

const getAllTotalBankCashAction = (payload) => ({
  type: GET_ALL_TOTAL_BANK_CASH,
  payload,
});

const createTransferAction = (payload) => ({
  type: CREATE_TRANSFER,
  payload,
});

const getFundTransferHistoryAction = (payload) => ({
  type: GET_FUND_TRANSFER_HISTORY,
  payload,
});

export const createGenerateInvoice = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${generateInvoiceCreateUrl}`, payload);
      dispatch(createGenerateInvoiceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const updateGenerateInvoice = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${generateInvoiceUpdateUrl}/${id}`, payload);
      dispatch(updateGenerateInvoiceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const deleteGenerateInvoice = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${generateInvoiceDeleteUrl}/${id}`);
      dispatch(deleteGenerateInvoiceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllGenerateInvoice = (
  page = 1,
  limit = 10,
  search = "",
  paymentType = "",
  mainPlan = "",
  subPlan = "",
  startDate = "",
  endDate = "",
  status = "",
  showAll = false,
  branchId = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${generateInvoiceGetAllUrl}?page=${page}&limit=${limit}&search=${search}&paymentType=${paymentType}&mainPlan=${mainPlan}&subPlan=${subPlan}&startDate=${startDate}&endDate=${endDate}&status=${status}&showAll=${showAll}&branchId=${branchId}`
      );
      dispatch(getAllGenerateInvoiceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const uniqueStudent = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${uniqueStudentUrl}`);
      dispatch(uniqueStudentAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const exportReportGenerateInvoice = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${generateInvoiceExportReportUrl}?ids=${ids}`
      );
      dispatch(exportReportGenerateInvoiceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getAllTotalBankCash = (startDate = "", endDate = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllTotalBankCashUrl}?startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getAllTotalBankCashAction(res.data));
      return res;
    } catch (error) {
      console.log("Error getAll total bank cash: ", error);
      throw error;
    }
  };
};

export const createTransfer = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createTransferCreateUrl}`, payload);
      dispatch(createTransferAction(res.data));
      return res;
    } catch (error) {
      console.log("Error create transfer: ", error);
      throw error;
    }
  };
};

export const getFundTransferHistory = (
  page = 1,
  limit = 10,
  startDate = "",
  endDate = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getFundTransferHistoryUrl}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getFundTransferHistoryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error get fund transfer history: ", error);
      throw error;
    }
  };
};
