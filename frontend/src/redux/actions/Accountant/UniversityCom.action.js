import Axios from "../../../api";
import {
  commissionEditInvoiceUrl,
  commissionQueryMailUrl,
  getAllUniversityCommissionUrl,
  getTotalB2BCommissionUrl,
  getTotalCommissionCountryUrl,
  getTotalCommissionUniversityUrl,
  studentByB2BUrl,
  studentInvoiceCreateUrl,
  studentInvoiceDeleteUrl,
  studentInvoiceGetAllUrl,
  studentInvoiceReportExportUrl,
  studentInvoiceUpdateUrl,
} from "../../routes/Accountant/UniversityCom.routes";

export const GET_ALL_UNIVERSITY_COMMISSION = "GET_ALL_UNIVERSITY_COMMISSION";
export const GET_TOTAL_COMMISSION_UNIVERSITY =
  "GET_TOTAL_COMMISSION_UNIVERSITY";
export const GET_TOTAL_COMMISSION_COUNTRY = "GET_TOTAL_COMMISSION_COUNTRY";
export const GET_TOTAL_B2B_COMMISSION = "GET_TOTAL_B2B_COMMISSION";
export const COMMISSION_QUERY_MAIL = "COMMISSION_QUERY_MAIL";
export const COMMISSION_EDIT_INVOICE = "COMMISSION_EDIT_INVOICE";
export const STUDENT_BY_B2B = "STUDENT_BY_B2B";

// student invoice
export const CREATE_STUDENT_INVOICE = "CREATE_STUDENT_INVOICE";
export const GET_ALL_STUDENT_INVOICE = "GET_ALL_STUDENT_INVOICE";
export const UPDATE_STUDENT_INVOICE = "UPDATE_STUDENT_INVOICE";
export const DELETE_STUDENT_INVOICE = "DELETE_STUDENT_INVOICE";
export const STUDENT_INVOICE_REPORT_EXPORT = "STUDENT_INVOICE_REPORT_EXPORT";

const getAllUniversityCommissionAction = (payload) => ({
  type: GET_ALL_UNIVERSITY_COMMISSION,
  payload,
});

const getTotalCommissionUniversityAction = (payload) => ({
  type: GET_TOTAL_COMMISSION_UNIVERSITY,
  payload,
});

const getTotalCommissionCountryAction = (payload) => ({
  type: GET_TOTAL_COMMISSION_COUNTRY,
  payload,
});
const getTotalB2BCommissionAction = (payload) => ({
  type: GET_TOTAL_B2B_COMMISSION,
  payload,
});
const commissionQueryMailAction = (payload) => ({
  type: COMMISSION_QUERY_MAIL,
  payload,
});
const studentByB2BAction = (payload) => ({
  type: STUDENT_BY_B2B,
  payload,
});
const studentInvoiceCreateAction = (payload) => ({
  type: CREATE_STUDENT_INVOICE,
  payload,
});

const studentInvoiceUpdateAction = (payload) => ({
  type: UPDATE_STUDENT_INVOICE,
  payload,
});
const studentInvoiceDeleteAction = (payload) => ({
  type: DELETE_STUDENT_INVOICE,
  payload,
});
const studentInvoiceGetAllAction = (payload) => ({
  type: GET_ALL_STUDENT_INVOICE,
  payload,
});

const commissionEditInvoiceAction = (payload) => ({
  type: COMMISSION_EDIT_INVOICE,
  payload,
});

const studentInvoiceReportExportAction = (payload) => ({
  type: STUDENT_INVOICE_REPORT_EXPORT,
  payload,
});

export const getAllUniversityCommission = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  institute,
  country,
  invoiceGenerate,
  paymentReceived
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllUniversityCommissionUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&institute=${institute}&country=${country}&invoiceGenerate=${invoiceGenerate}&paymentReceived=${paymentReceived}`
      );
      dispatch(getAllUniversityCommissionAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getTotalCommissionUniversity = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getTotalCommissionUniversityUrl}`);
      dispatch(getTotalCommissionUniversityAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getTotalCommissionCountry = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getTotalCommissionCountryUrl}`);
      dispatch(getTotalCommissionCountryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getTotalB2BCommission = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  institute,
  type,
  country,
  status
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getTotalB2BCommissionUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&institute=${institute}&type=${type}&country=${country}&status=${status}`
      );
      dispatch(getTotalB2BCommissionAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const commissionQueryMail = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${commissionQueryMailUrl}/${id}`);
      dispatch(commissionQueryMailAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const commissionEditInvoice = (ids, edit, body = {}) => {
  return async (dispatch) => {
    try {
      const params = new URLSearchParams();
      params.append("ids", Array.isArray(ids) ? ids.join(",") : ids);
      if (edit === true) params.append("edit", "true");
      const res = await Axios.put(
        `${commissionEditInvoiceUrl}?${params.toString()}`,
        body
      );
      dispatch(commissionEditInvoiceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const studentByB2B = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${studentByB2BUrl}/${id}`);
      dispatch(studentByB2BAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

// student invoice
export const studentInvoiceCreate = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${studentInvoiceCreateUrl}`, payload);
      dispatch(studentInvoiceCreateAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const studentInvoiceGetAll = (page = 1, limit = 10, search = "", b2bId, startDate ,endDate, status) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${studentInvoiceGetAllUrl}?page=${page}&limit=${limit}&search=${search}&b2bId=${b2bId}&startDate=${startDate}&endDate=${endDate}&status=${status}`
      );
      dispatch(studentInvoiceGetAllAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const studentInvoiceUpdate = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${studentInvoiceUpdateUrl}/${id}`, payload);
      dispatch(studentInvoiceUpdateAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const studentInvoiceDelete = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${studentInvoiceDeleteUrl}/${id}`);
      dispatch(studentInvoiceDeleteAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const studentInvoiceReportExport = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${studentInvoiceReportExportUrl}?ids=${ids}`);
      dispatch(studentInvoiceReportExportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
}