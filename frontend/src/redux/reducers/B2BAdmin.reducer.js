import { CREATE_B2B_ADMIN, DELETE_B2B_ADMIN, GET_ALL_B2B_ADMIN, GET_COUNTRY_LIST_B2B_ADMIN, GET_ONE_B2B_ADMIN, UPDATE_B2B_ADMIN } from "../actions/B2BAdmin.action";

const initialState = {
    createB2BAdmin: '',
    updateB2BAdmin: '',
    getAllB2BAdmin: '',
    deleteB2BAdmin: '',
    getB2BAdminById: '',
    getB2BAdminCountryList: '',
};

export const B2BAdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_B2B_ADMIN:
            return { ...state, createB2BAdmin: action.payload };
        case UPDATE_B2B_ADMIN:
            return { ...state, updateB2BAdmin: action.payload };
        case GET_ALL_B2B_ADMIN:
            return { ...state, getAllB2BAdmin: action.payload };
        case DELETE_B2B_ADMIN:
            return { ...state, deleteB2BAdmin: action.payload };
        case GET_ONE_B2B_ADMIN:
            return { ...state, getB2BAdminById: action.payload };
        case GET_COUNTRY_LIST_B2B_ADMIN:
            return { ...state, getB2BAdminCountryList: action.payload };
        default:
            return state;
    }
}