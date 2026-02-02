import { create } from "@mui/material/styles/createTransitions";
import { CREATE_CTC_FOR_DASHBOARD_CALLING, createCtcCallingForDashboard, GET_ALL_DASHBOARD_TOTAL } from "../actions/Dashboard.action";

const initialState = {
  getAllDashboardTotal: "",
  createCtcCallingForDashboard: "",
};

export const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_DASHBOARD_TOTAL:
      return { ...state, getAllDashboardTotal: action.payload };
    case CREATE_CTC_FOR_DASHBOARD_CALLING:
      return { ...state, createCtcCallingForDashboard: action.payload };  
    default:
      return state;
  }
};
