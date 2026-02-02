import {
  EXPORT_ACCOUNTANT_DATA,
  GET_ALL_COUNTRY,
  GET_ALL_INSTITUTE,
  GET_ALL_TOTAL_ADMIAAION,
} from "../../actions/Accountant/EligibleStudents.action";

const initialState = {
  getAllTotalAdmission: "",
  getAllInstitute: "",
  getAllCountry: "",
  exportAccountantData: "",
};

export const totalAdmissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TOTAL_ADMIAAION:
      return { ...state, getAllTotalAdmission: action.payload };
    case GET_ALL_INSTITUTE:
      return { ...state, getAllInstitute: action.payload };
    case GET_ALL_COUNTRY:
      return { ...state, getAllCountry: action.payload };
    case EXPORT_ACCOUNTANT_DATA:
      return { ...state, exportAccountantData: action.payload };
    default:
      return state;
  }
};
