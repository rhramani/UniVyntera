import Axios from "../../../api.js";
import { exportDataAccountantUrl, getAllAccountantCountryUrl, getAllAccountantInstituteUrl, getAllTotalAdmissionUrl } from "../../routes/Accountant/EligibleStudents.routes.js";

export const GET_ALL_TOTAL_ADMIAAION = "GET_ALL_TOTAL_ADMIAAION";
export const GET_ALL_INSTITUTE = "GET_ALL_INSTITUTE";
export const GET_ALL_COUNTRY = "GET_ALL_COUNTRY";
export const EXPORT_ACCOUNTANT_DATA = "EXPORT_ACCOUNTANT_DATA";

const getAllTotalAdmissionAction = (payload) => ({
  type: GET_ALL_TOTAL_ADMIAAION,
  payload,
});

const getAllInstituteAction = (payload) => ({
  type: GET_ALL_INSTITUTE,
  payload,
});

const getAllCountryAction = (payload) => ({
  type: GET_ALL_COUNTRY,
  payload,
});

const exportAccountantDataAction = (payload) => ({
  type: EXPORT_ACCOUNTANT_DATA,
  payload,
});

export const getAllTotalAdmission = (page = 1, limit = 10, search = "", startDate, endDate, institute, type, country, branch, verificationSent, sideConfirmation) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllTotalAdmissionUrl}?page=${page}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}&institute=${institute}&type=${type}&country=${country}&branch=${branch}&verificationSent=${verificationSent}&sideConfirmation=${sideConfirmation}`
      );
      dispatch(getAllTotalAdmissionAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAllTotalAdmission:", error);
      throw error;
    }
  };
};

export const getAllAccountantInstitute = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllAccountantInstituteUrl}`);
      dispatch(getAllInstituteAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getInstitute: ", error);
    }
  }
}

export const getAllAccountantCountry = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllAccountantCountryUrl}`);
      dispatch(getAllCountryAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getCountry: ", error);
    }
  }
}

export const exportAccountantData = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${exportDataAccountantUrl}?ids=${ids}`);
      dispatch(exportAccountantDataAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in exportAccountantData: ", error);
    }
  }
}