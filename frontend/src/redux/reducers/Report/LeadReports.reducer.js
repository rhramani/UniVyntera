import { EXPORT_DATA_LEAD_REPORTS, GET_ALL_LEAD_REPORT, GET_ALL_SOURSE_OF_REFERENCE } from "../../actions/Report/LeadReports.action";

const initialState = {
  getAllLeadReport: "",
  getAllSourceOfReference: "",
  exportDataLeadReports: "",
};

export const leadReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_LEAD_REPORT:
      return { ...state, getAllLeadReport: action.payload };
    case GET_ALL_SOURSE_OF_REFERENCE:
      return { ...state, getAllSourceOfReference: action.payload };
    case EXPORT_DATA_LEAD_REPORTS:
      return { ...state, exportDataLeadReports: action.payload };
    default:
      return state;
  }
};
