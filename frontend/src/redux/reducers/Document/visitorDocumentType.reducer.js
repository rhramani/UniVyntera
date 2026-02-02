import {
  CREATE_VISITOR_DOCUMENT_TYPE,
  DELETE_VISITOR_DOCUMENT_TYPE,
  GET_ALL_VISITOR_DOCUMENT_TYPE,
  UPDATE_VISITOR_DOCUMENT_TYPE,
} from "../../actions/Document/visitorDocumentType.action";

const initialState = {
  createVisitorDocumentType: "",
  updateVisitorDocumentType: "",
  getAllVisitorDocumentType: "",
  deleteVisitorDocumentType: "",
};

export const visitorDocumentTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VISITOR_DOCUMENT_TYPE:
      return { ...state, createVisitorDocumentType: action.payload };
    case UPDATE_VISITOR_DOCUMENT_TYPE:
      return { ...state, updateVisitorDocumentType: action.payload };
    case GET_ALL_VISITOR_DOCUMENT_TYPE:
      return { ...state, getAllVisitorDocumentType: action.payload };
    case DELETE_VISITOR_DOCUMENT_TYPE:
      return { ...state, deleteVisitorDocumentType: action.payload };
    default:
      return state;
  }
};
