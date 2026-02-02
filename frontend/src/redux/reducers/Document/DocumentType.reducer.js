import {
    CREATE_DOCUMENT_TYPE,
    UPDATE_DOCUMENT_TYPE,
    GET_ALL_DOCUMENT_TYPE,
    DELETE_DOCUMENT_TYPE,
} from "../../actions/Document/DocumentType.action";

const initialState = {
  CreateDocumentType: "",
  UpdateDocumentType: "",
  GetAllDocumentType: "",
  DeleteDocumentType: "",
};

export const documentTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_DOCUMENT_TYPE:
      return { ...state, CreateDocumentType: action.payload };
    case UPDATE_DOCUMENT_TYPE:
      return { ...state, UpdateDocumentType: action.payload };
    case GET_ALL_DOCUMENT_TYPE:
      return { ...state, GetAllDocumentType: action.payload };
    case DELETE_DOCUMENT_TYPE:
      return { ...state, DeleteDocumentType: action.payload };
    default:
      return state;
  }
};
