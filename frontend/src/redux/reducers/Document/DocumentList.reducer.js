import {
    CREATE_DOCUMENT_LIST,
    UPDATE_DOCUMENT_LIST,
    GET_ALL_DOCUMENT_LIST,
    DELETE_DOCUMENT_LIST,
} from "../../actions/Document/DocumentList.action";

const initialState = {
  CreateDocumentList: "",
  UpdateDocumentList: "",
  GetAllDocumentList: "",
  DeleteDocumentList: "",
};

export const documentListReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_DOCUMENT_LIST:
      return { ...state, CreateDocumentList: action.payload };
    case UPDATE_DOCUMENT_LIST:
      return { ...state, UpdateDocumentList: action.payload };
    case GET_ALL_DOCUMENT_LIST:
      return { ...state, GetAllDocumentList: action.payload };
    case DELETE_DOCUMENT_LIST:
      return { ...state, DeleteDocumentList: action.payload };
    default:
      return state;
  }
};
