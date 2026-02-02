import {
  COUNTRY_DROPDOWN,
  CREATE_COUNTRY,
  DELETE_COUNTRY,
  GET_ALL_COUNTRY,
  UPDATE_COUNTRY,
} from "../../actions/Master/Country.action";

const initialState = {
  CreateCountry: "",
  UpdateCountry: "",
  GetAllCountry: "",
  DeleteCountry: "",
  CountryDropDown: "",
};

export const countryReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COUNTRY:
      return { ...state, CreateCountry: action.payload };
    case UPDATE_COUNTRY:
      return { ...state, UpdateCountry: action.payload };
    case GET_ALL_COUNTRY:
      return { ...state, GetAllCountry: action.payload };
    case DELETE_COUNTRY:
      return { ...state, DeleteCountry: action.payload };
    case COUNTRY_DROPDOWN:
      return { ...state, CountryDropDown: action.payload };
    default:
      return state;
  }
};
