import { CREATE_VISITOR_APPLICATION, DELETE_VISITOR_APPLICATION, DOWNLOAD_VISITOR_DOCUMENT, GET_ALL_VISITOR_APPLICATION, GET_COUNTRY_WISE_VISITOR_DOCUMENT, GET_ONE_VISITOR_APPLICATION, PENDING_VISITOR_DOC_LIST, PENDING_VISITOR_DOC_MAIL, UPDATE_VISITOR_APPLICATION, VISITOR_APPLICATION_CLONE } from "../../actions/Visitor/VisitorApplication.action";

const initialState = {
  createVisitorApplication: "",
  updateVisitorApplication: "",
  getAllVisitorApplication: "",
  deleteVisitorApplication: "",
  getOneVisitorApplication: "",
  getCountryWiseVisitorDocument: "",
  downloadVisitorDocument: "",
  visitorApplicationClone: "",
  pendingVisitorDocList: "",
  pendingVisitorDocMail: "",
};

export const visitorApplicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VISITOR_APPLICATION:
      return { ...state, createVisitorApplication: action.payload };
    case UPDATE_VISITOR_APPLICATION:
      return { ...state, updateVisitorApplication: action.payload };
    case GET_ALL_VISITOR_APPLICATION:
      return { ...state, getAllVisitorApplication: action.payload };
    case DELETE_VISITOR_APPLICATION:
      return { ...state, deleteVisitorApplication: action.payload };
    case GET_ONE_VISITOR_APPLICATION:
      return { ...state, getOneVisitorApplication: action.payload };
    case GET_COUNTRY_WISE_VISITOR_DOCUMENT:
      return { ...state, getCountryWiseVisitorDocument: action.payload };
    case DOWNLOAD_VISITOR_DOCUMENT:
      return { ...state, downloadVisitorDocument: action.payload };
    case VISITOR_APPLICATION_CLONE:
      return { ...state, visitorApplicationClone: action.payload };
    case PENDING_VISITOR_DOC_LIST:
      return { ...state, pendingVisitorDocList: action.payload };
    case PENDING_VISITOR_DOC_MAIL:
      return { ...state, pendingVisitorDocMail: action.payload };
    default:
      return state;
  }
};
