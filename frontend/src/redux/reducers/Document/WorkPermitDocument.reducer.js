import { CREATE_WORK_PERMIT_DOCUMENT, DELETE_WORK_PERMIT_DOCUMENT, GET_ALL_WORK_PERMIT_DOCUMENT, UPDATE_WORK_PERMIT_DOCUMENT } from "../../actions/Document/WorkPermitDocument.action";


const initialState = {
  CreateWorkPermitDocument: "",
  UpdateWorkPermitDocument: "",
  GetAllWorkPermitDocument: "",
  DeleteWorkPermitDocument: "",
};

export const WorkPermitDocumentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_WORK_PERMIT_DOCUMENT:
      return { ...state, CreateWorkPermitDocument: action.payload };
    case UPDATE_WORK_PERMIT_DOCUMENT:
      return { ...state, UpdateWorkPermitDocument: action.payload };
    case GET_ALL_WORK_PERMIT_DOCUMENT:
      return { ...state, GetAllWorkPermitDocument: action.payload };
    case DELETE_WORK_PERMIT_DOCUMENT:
      return { ...state, DeleteWorkPermitDocument: action.payload };
    default:
      return state;
  }
};
