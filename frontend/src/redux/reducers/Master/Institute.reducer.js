import {
  CITY_DROPDOWN,
  COUNTRY_DROPDOWN,
  CREATE_DIRECT_INSTITUTE,
  CREATE_INSTITUTE,
  DELETE_DIRECT_INSTITUTE,
  DELETE_INSTITUTE,
  GET_ALL_DIRECT_INSTITUTE,
  GET_ALL_INSTITUTE,
  GET_BY_ID_DIRECT_INSTITUTE,
  GET_BY_ID_INSTITUTE,
  INSTITUTE_WISE_CAMPUS_DROPDOWN,
  INSTITUTE_WISE_COUNTRY_DROPDOWN,
  STATE_DROPDOWN,
  UNIVERSITY_COUNTRY_DROPDOWN,
  UPDATE_DIRECT_INSTITUTE,
  UPDATE_INSTITUTE,
} from "../../actions/Master/Institute.action";

const initialState = {
  createInstitute: "",
  updateInstitute: "",
  getByIdInstitute: "",
  getAllInstitute: "",
  deleteInstitute: "",
  countryDropDown: "",
  stateDropDown: "",
  cityDropDown: "",
  universityCountryDropDown: "",
  instituteWiseCountryDropDown: "",
  inisituteWiseCampusDropDown: "",

  // Direct Institute
  createDirectInstitute: "",
  updateDirectInstitute: "",
  getByIdDirectInstitute: "",
  getAllDirectInstitute: "",
  deleteDirectInstitute: "",
};

export const instituteReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_INSTITUTE:
      return { ...state, createInstitute: action.payload };
    case UPDATE_INSTITUTE:
      return { ...state, updateInstitute: action.payload };
    case GET_BY_ID_INSTITUTE:
      return { ...state, getByIdInstitute: action.payload };
    case GET_ALL_INSTITUTE:
      return { ...state, getAllInstitute: action.payload };
    case DELETE_INSTITUTE:
      return { ...state, deleteInstitute: action.payload };
    case COUNTRY_DROPDOWN:
      return { ...state, countryDropDown: action.payload };
    case STATE_DROPDOWN:
      return { ...state, stateDropDown: action.payload };
    case CITY_DROPDOWN:
      return { ...state, cityDropDown: action.payload };
    case UNIVERSITY_COUNTRY_DROPDOWN:
      return { ...state, universityCountryDropDown: action.payload };
    case INSTITUTE_WISE_COUNTRY_DROPDOWN:
      return { ...state, instituteWiseCountryDropDown: action.payload };
    case INSTITUTE_WISE_CAMPUS_DROPDOWN:
      return { ...state, inisituteWiseCampusDropDown: action.payload };

    // Direct Institute
    case CREATE_DIRECT_INSTITUTE:
      return { ...state, createDirectInstitute: action.payload };
    case UPDATE_DIRECT_INSTITUTE:
      return { ...state, updateDirectInstitute: action.payload };
    case GET_BY_ID_DIRECT_INSTITUTE:
      return { ...state, getByIdDirectInstitute: action.payload };
    case GET_ALL_DIRECT_INSTITUTE:
      return { ...state, getAllDirectInstitute: action.payload };
    case DELETE_DIRECT_INSTITUTE:
      return { ...state, deleteDirectInstitute: action.payload };
    default:
      return state;
  }
};
