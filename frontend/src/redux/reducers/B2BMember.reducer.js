import { CREATE_B2B_MEMBER, DELETE_B2B_MEMBER, GET_ALL_B2B_MEMBER, GET_ONE_B2B_MEMBER, UPDATE_B2B_MEMBER } from "../actions/B2BMember.action";

const initialState = {
    createB2BMember: '',
    updateB2BMember: '',
    getAllB2BMember: '',
    deleteB2BMember: '',
    getB2BMemberById: '',
}

export const B2BMemberReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_B2B_MEMBER:
            return { ...state, createB2BMember: action.payload };
        case UPDATE_B2B_MEMBER:
            return { ...state, updateB2BMember: action.payload };
        case GET_ALL_B2B_MEMBER:
            return { ...state, getAllB2BMember: action.payload };
        case DELETE_B2B_MEMBER:
            return { ...state, deleteB2BMember: action.payload };
        case GET_ONE_B2B_MEMBER:
            return { ...state, getB2BMemberById: action.payload };
        default:
            return state;
    }
}