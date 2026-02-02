import Axios from "../../../api.js";
import {
  exportPendingAgreementDataUrl,
  exportMostPreferredCoursesUrl,
  exportStudentReportDownloadUrl,
  getAllInstituteUrl,
  getAllIntakeUrl,
  getAllMostPreferredCourseUrl,
  getAllPendingAgreementUrl,
  getAllStudentReportUrl,
  partenerCommissionReportUrl,
  getFiltersForMostPrefferedCourseUrl,
  partenerPendingB2BInvoiceUrl,
  partnerConversionReportUrl,
  partnerUniqueB2BAndBranchListUrl,
  partnerConversionReportExportUrl,
  getAllUniversityCommissionReportsUrl,
  uniquePreferredCountriesUrl,
  getFeePaymentReportUrl,
  getStudentFinanceSummaryReportUrl,
  getUniversityPaymentCollectionUrl,
  exportFeePaymentReportsUrl,
  exportStudentFinanceSummaryReportUrl,
  exportUniversityPaymentCollectionUrl,
  totalPendingB2BCountryUrl,
  getVisaProcessReportUrl,
  exportVisaProcessReportUrl,
} from "../../routes/Report/StudentApplicationReport.route";

export const GET_ALL_INTAKE = "GET_ALL_INTAKE";
export const GET_ALL_INSTITUTE = "GET_ALL_INSTITUTE";
export const GET_ALL_STUDENT_REPORT = "GET_ALL_STUDENT_REPORT";
export const UNIQUE_PREFERRED_COUNTRIES = "UNIQUE_PREFERRED_COUNTRIES";
export const GET_ALL_PENDING_AGREEMENT = "GET_ALL_PENDING_AGREEMENT";
export const GET_ALL_MOST_PREFERRED_COURSE = "GET_ALL_MOST_PREFERRED_COURSE";
export const DOWNLOAD_STUDENT_APPLICATION_DATA =
  "DOWNLOAD_STUDENT_APPLICATION_DATA";
export const EXPORT_MOST_PREFERRED_COURSE = "EXPORT_MOST_PREFERRED_COURSE";
export const EXPORT_PENDING_AGREEMENT = "EXPORT_PENDING_AGREEMENT";
export const GET_FILTER_OPTION = "GET_FILTER_OPTION";

// partner commission
export const PARTNER_COMMISSION_REPORT = "PARTNER_COMMISSION_REPORT";
export const PARTNER_PENDING_B2B_INVOICE = "PARTNER_PENDING_B2B_INVOICE";
export const PARTNER_UNIQUE_B2B_AND_BRANCH_LIST =
  "PARTNER_UNIQUE_B2B_AND_BRANCH_LIST";
export const PARTNER_CONVERSION_REPORT = "PARTNER_CONVERSION_REPORT";
export const PARTNER_CONVERSION_REPORT_EXPORT =
  "PARTNER_CONVERSION_REPORT_EXPORT";
export const TOTAL_PENDING_B2B_COUNTRY = "TOTAL_PENDING_B2B_COUNTRY";  
  
// university commission
export const UNIVERSITY_COMMISSION_REPORT = "UNIVERSITY_COMMISSION_REPORT";

// finance reports
export const GET_FEE_PAYMENT_REPORT = "GET_FEE_PAYMENT_REPORT";
export const GET_STUDENT_FINANCE_SUMMARY_REPORT = "GET_STUDENT_FINANCE_SUMMARY_REPORT";
export const GET_UNIVERSITY_PAYMENT_COLLECTION_REPORT = "GET_UNIVERSITY_PAYMENT_COLLECTION_REPORT";
export const EXPORT_FEE_PAYMENT_REPORT = "EXPORT_FEE_PAYMENT_REPORT";
export const EXPORT_STUDENT_FINANCE_SUMMARY_REPORT = "EXPORT_STUDENT_FINANCE_SUMMARY_REPORT";
export const EXPORT_UNIVERSITY_PAYMENT_COLLECTION_REPORT = "EXPORT_UNIVERSITY_PAYMENT_COLLECTION_REPORT";

// visa report
export const GET_VISA_PROCESS_REPORT = "GET_VISA_PROCESS_REPORT";
export const EXPORT_VISA_PROCESS_REPORT = "EXPORT_VISA_PROCESS_REPORT";

const getAllIntakeAction = (data) => ({
  type: GET_ALL_INTAKE,
  payload: data,
});
const getAllInstituteAction = (data) => ({
  type: GET_ALL_INSTITUTE,
  payload: data,
});
const getAllStudentReportAction = (data) => ({
  type: GET_ALL_STUDENT_REPORT,
  payload: data,
});

const uniquePreferredCountriesAction = (data) => ({
  type: UNIQUE_PREFERRED_COUNTRIES,
  payload: data,
})
const getAllMostPreferredCourseAction = (data) => ({
  type: GET_ALL_MOST_PREFERRED_COURSE,
  payload: data,
});
const getAllPendingAgreementAction = (data) => ({
  type: GET_ALL_PENDING_AGREEMENT,
  payload: data,
});
const downloadStudentApplicationDataAction = (data) => ({
  type: DOWNLOAD_STUDENT_APPLICATION_DATA,
  payload: data,
});
const exportMostPreferredCourseDataAction = (data) => ({
  type: EXPORT_MOST_PREFERRED_COURSE,
  payload: data,
});
const exportPendingAgreementDataAction = (data) => ({
  type: EXPORT_PENDING_AGREEMENT,
  payload: data,
});
const getFilterMostPreferredCourseAction = (data) => ({
  type: GET_FILTER_OPTION,
  payload: data,
});

// partner commission
const exportPartnerCommissionAction = (data) => ({
  type: PARTNER_COMMISSION_REPORT,
  payload: data,
});

const partnerPendingB2BInvoiceAction = (data) => ({
  type: PARTNER_PENDING_B2B_INVOICE,
  payload: data,
});

const partnerUniqueBranchAndBranchListAction = (data) => ({
  type: PARTNER_UNIQUE_B2B_AND_BRANCH_LIST,
  payload: data,
});

const partnerConversionReportAction = (data) => ({
  type: PARTNER_CONVERSION_REPORT,
  payload: data,
});

const partnerConversionReportExportAction = (data) => ({
  type: PARTNER_CONVERSION_REPORT_EXPORT,
  payload: data,
});

const totalPendingB2BCountryAction = (data) => ({
  type: TOTAL_PENDING_B2B_COUNTRY,
  payload: data,
});

// university commission

const universityCommissionReportAction = (data) => ({
  type: UNIVERSITY_COMMISSION_REPORT,
  payload: data,
});

// finance reports
const getFeePaymentReportAction = (data) => ({
  type: GET_FEE_PAYMENT_REPORT,
  payload: data,
});

const getStudentFinanceSummaryReportAction = (data) => ({
  type: GET_STUDENT_FINANCE_SUMMARY_REPORT,
  payload: data,
});

const getUniversityPaymentCollectionReportAction = (data) => ({
  type: GET_UNIVERSITY_PAYMENT_COLLECTION_REPORT,
  payload: data,
});

const exportFeePaymentReportAction = (data) => ({
  type: EXPORT_FEE_PAYMENT_REPORT,
  payload: data,
});

const exportStudentFinanceSummaryReportAction = (data) => ({
  type: EXPORT_STUDENT_FINANCE_SUMMARY_REPORT,
  payload: data,
});

const exportUniversityPaymentCollectionReportAction = (data) => ({
  type: EXPORT_UNIVERSITY_PAYMENT_COLLECTION_REPORT,
  payload: data,
});

// visa report
const getVisaProcessReportAction = (data) => ({
  type: GET_VISA_PROCESS_REPORT,
  payload: data,
});

const exportVisaProcessReportAction = (data) => ({
  type: EXPORT_VISA_PROCESS_REPORT,
  payload: data,
});

export const getAllIntake = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllIntakeUrl}`);
      dispatch(getAllIntakeAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all intakes", error);
      throw error;
    }
  };
};

export const getInstitute = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllInstituteUrl}`);
      dispatch(getAllInstituteAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all Institute", error);
      throw error;
    }
  };
};

export const getAllStudentReport = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  mainStatus,
  branchId,
  // role,
  filterUserId,
  showAll,
  intakeMonth,
  intakeYear,
  institute,
  applicationType,
  country,
  type,
  b2bId
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllStudentReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&mainStatus=${mainStatus}&branchId=${branchId}&filterUserId=${filterUserId}&showAll=${showAll}&intakeMonth=${intakeMonth}&intakeYear=${intakeYear}&institute=${institute}&applicationType=${applicationType}&country=${country}&type=${type}&b2bId=${b2bId}`
      );
      dispatch(getAllStudentReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all student report", error);
      throw error;
    }
  };
};

export const getUniquePreferredCountries = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${uniquePreferredCountriesUrl}`);
      dispatch(uniquePreferredCountriesAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get unique preferred countries", error);
      throw error;
    }
  };
};

export const getAllMostPreferredCourse = (
  page = 1,
  limit = 10,
  search = "",
  institute,
  country,
  course
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllMostPreferredCourseUrl}?page=${page}&limit=${limit}&search=${search}&institute=${institute}&country=${country}&course=${course}`
      );
      dispatch(getAllMostPreferredCourseAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all most preferred country", error);
      throw error;
    }
  };
};

export const getAllPendingAgreement = (
  page = 1,
  limit = 10,
  search = "",
  status
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllPendingAgreementUrl}?page=${page}&limit=${limit}&search=${search}&status=${status}`
      );
      dispatch(getAllPendingAgreementAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in get all pending agreement", error);
      throw error;
    }
  };
};

export const exportStudentApplicationReports = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${exportStudentReportDownloadUrl}?ids=${ids}`
      );
      dispatch(downloadStudentApplicationDataAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const exportMostPreferredCourseReports = (
  search,
  institute,
  country,
  course
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${exportMostPreferredCoursesUrl}?search=${search}&institute=${institute}&country=${country}&course=${course}`
      );
      dispatch(exportMostPreferredCourseDataAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const exportPendingAgreementReports = (search, status) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${exportPendingAgreementDataUrl}?search=${search}&status=${status}`
      );
      dispatch(exportPendingAgreementDataAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const getFilterMostPreferredCourse = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getFiltersForMostPrefferedCourseUrl}`);
      dispatch(getFilterMostPreferredCourseAction(res.data));
      return res;
    } catch (error) {
      console.log(
        "Error fetching in get all most preferrable course filter",
        error
      );
      throw error;
    }
  };
};

// partner commission
export const partnerCommissionReportGetAll = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  type,
  institute,
  country,
  status,
  b2bId,
  branchId
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${partenerCommissionReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&type=${type}&institute=${institute}&country=${country}&status=${status}&b2bId=${b2bId}&branchId=${branchId}`
      );
      dispatch(exportPartnerCommissionAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const partnerPendingB2BInvoiceGetAll = (
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  country,
  b2bId,
  branchId,
  showAll,
  type
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${partenerPendingB2BInvoiceUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&country=${country}&b2bId=${b2bId}&branchId=${branchId}&showAll=${showAll}&type=${type}`
      );
      dispatch(partnerPendingB2BInvoiceAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const partnerUniqueB2BAndBranchListGetAll = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${partnerUniqueB2BAndBranchListUrl}`);
      dispatch(partnerUniqueBranchAndBranchListAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const partnerConversionReportGetAll = (
  page = 1,
  limit = 10,
  search = "",
  type
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${partnerConversionReportUrl}?page=${page}&limit=${limit}&search=${search}&type=${type}`
      );
      dispatch(partnerConversionReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const partnerConversionReportExport = (type) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${partnerConversionReportExportUrl}?type=${type}`
      );
      dispatch(partnerConversionReportExportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const totalB2BPendingCountry = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${totalPendingB2BCountryUrl}`);
      dispatch(totalPendingB2BCountryAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
}

// university commission

export const universityCommissionReportsGetAll = (
  page = 1,
  limit = 10,
  search = "",
  type,
  status,
  startDate,
  endDate,
  b2bId,
  branchId,
  reportType,
  intakeYear,
  intakeMonth,
  showAll
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllUniversityCommissionReportsUrl}?page=${page}&limit=${limit}&search=${search}&type=${type}&status=${status}&startDate=${startDate}&endDate=${endDate}&b2bId=${b2bId}&branchId=${branchId}&reportType=${reportType}&intakeYear=${intakeYear}&intakeMonth=${intakeMonth}&showAll=${showAll}`
      );
      dispatch(universityCommissionReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

// finance reports

export const getFeePaymentReport = (page = 1, limit = 10, search = "", feeStatus, startDate, endDate) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getFeePaymentReportUrl}?page=${page}&limit=${limit}&search=${search}&feeStatus=${feeStatus}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getFeePaymentReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
}

export const getStudentFinanceSummaryReport = (page = 1, limit = 10, search = "", type, startDate, endDate) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getStudentFinanceSummaryReportUrl}?page=${page}&limit=${limit}&search=${search}&type=${type}&startDate=${startDate}&endDate=${endDate}`
      );
      dispatch(getStudentFinanceSummaryReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
}

export const getUniversityPaymentCollectionReport = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getUniversityPaymentCollectionUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getUniversityPaymentCollectionReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
}

export const feePaymentReportsExport = (search = "", feeStatus) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${exportFeePaymentReportsUrl}?search=${search}&feeStatus=${feeStatus}`);
      dispatch(exportFeePaymentReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
}


export const studentFinanceSummaryReportsExport = (search = "", type) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${exportStudentFinanceSummaryReportUrl}?search=${search}&type=${type}`);
      dispatch(exportStudentFinanceSummaryReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
}

export const universityPaymentCollectionReportsExport = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${exportUniversityPaymentCollectionUrl}`);
      dispatch(exportUniversityPaymentCollectionReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
}

export const visaProcessReportsGet = (page = 1, limit = 10, search = "", startDate, endDate, status, country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getVisaProcessReportUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&status=${status}&country=${country}`
      );
      dispatch(getVisaProcessReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};

export const visaProcessReportsExport = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${exportVisaProcessReportUrl}?ids=${ids}`);
      dispatch(exportVisaProcessReportAction(res.data));
      return res;
    } catch (error) {
      console.log("Error fetching in export student application data", error);
      throw error;
    }
  };
};