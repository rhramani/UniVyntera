import { CREATE_VISITOR_DOCUMENT_LIST, DELETE_VISITOR_DOCUMENT_LIST, GET_ALL_VISITOR_DOCUMENT_LIST, UPDATE_VISITOR_DOCUMENT_LIST } from "../../actions/Document/VisitorDocumentList.action";

const initialState = {
        createVisitorDocumentList: "",
        updateVisitorDocumentList: "",
        getAllVisitorDocumentList: "",
        deleteVisitorDocumentList: "",
};

export const visitorDocumentListReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_VISITOR_DOCUMENT_LIST:
            return { ...state, createVisitorDocumentList: action.payload }
        case UPDATE_VISITOR_DOCUMENT_LIST:
            return { ...state, updateVisitorDocumentList: action.payload }
        case GET_ALL_VISITOR_DOCUMENT_LIST:
            return { ...state, getAllVisitorDocumentList: action.payload }
        case DELETE_VISITOR_DOCUMENT_LIST:
            return { ...state, deleteVisitorDocumentList: action.payload }
        default:
            return state;
    }
};