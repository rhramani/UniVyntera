import { CREATE_FOLDER_ACTION, CREATE_PROMOTIONAL_DOCUMENT, CREATE_SUB_PROMOTIONAL_DOCUMENT, DELETE_PROMOTIONAL_DOCUMENT, GET_ALL_PROMOTIONAL_DOCUMENT, GET_ONE_PROMOTIONAL_DOCUMENT, UPDATE_PROMOTIONAL_DOCUMENT } from "../actions/PromotionalDocument.action";

const initialState = {
    createPromotionalDoc: '',
    updatePromotionalDoc: '',
    getAllPromotionalDoc: '',
    deletePromotionalDoc: '',
    getPromotionalDocById: '',
    createSubPromotionalDoc: '',
    createFolder: ''
};

export const PromotionalDocumentReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PROMOTIONAL_DOCUMENT:
            return { ...state, createPromotionalDoc: action.payload };
        case UPDATE_PROMOTIONAL_DOCUMENT:
            return { ...state, updatePromotionalDoc: action.payload };
        case GET_ALL_PROMOTIONAL_DOCUMENT:
            return { ...state, getAllPromotionalDoc: action.payload };
        case DELETE_PROMOTIONAL_DOCUMENT:
            return { ...state, deletePromotionalDoc: action.payload };
        case GET_ONE_PROMOTIONAL_DOCUMENT:
            return { ...state, getPromotionalDocById: action.payload };
        case CREATE_SUB_PROMOTIONAL_DOCUMENT:
            return { ...state, createSubPromotionalDoc: action.payload };
        case CREATE_FOLDER_ACTION:
            return { ...state, createFolder: action.payload };
        default:
            return state;
    }
}