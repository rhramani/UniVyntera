import {
  CREATE_VISITOR_DOCUMENT,
  DELETE_VISITOR_DOCUMENT,
  GET_ALL_VISITOR_DOCUMENT,
  UPDATE_VISITOR_DOCUMENT,
} from "../../actions/Document/VisitorDocuments.action";

const initialState = {
  CreateVisitorDocument: "",
  UpdateVisitorDocument: "",
  GetAllVisitorDocument: "",
  DeleteVisitorDocument: "",
};

export const VisitorDocumentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VISITOR_DOCUMENT:
      return { ...state, CreateVisitorDocument: action.payload };
    case UPDATE_VISITOR_DOCUMENT:
      return { ...state, UpdateVisitorDocument: action.payload };
    case GET_ALL_VISITOR_DOCUMENT:
      return { ...state, GetAllVisitorDocument: action.payload };
    case DELETE_VISITOR_DOCUMENT:
      return { ...state, DeleteVisitorDocument: action.payload };
    default:
      return state;
  }
};
