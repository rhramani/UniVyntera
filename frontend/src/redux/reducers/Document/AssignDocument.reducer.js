import {
    CREATE_COUNTRY_DOCUMENT,
    UPDATE_COUNTRY_DOCUMENT,
    GET_ALL_COUNTRY_DOCUMENT,
    DELETE_COUNTRY_DOCUMENT
} from "../../actions/Document/AssignDocument.action";

const initialState = {
  CreateCountryDocument: "",
  UpdateCountryDocument: "",
  GetAllCountryDocument: "",
  DeleteCountryDocument: "",
};

export const countryDocumentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COUNTRY_DOCUMENT:
      return { ...state, CreateCountryDocument: action.payload };
    case UPDATE_COUNTRY_DOCUMENT:
      return { ...state, UpdateCountryDocument: action.payload };
    case GET_ALL_COUNTRY_DOCUMENT:
      return { ...state, GetAllCountryDocument: action.payload };
    case DELETE_COUNTRY_DOCUMENT:
      return { ...state, DeleteCountryDocument: action.payload };
    default:
      return state;
  }
};
