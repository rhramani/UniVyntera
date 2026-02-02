import { CITY_DROPDOWN, CREATE_CITY, DELETE_CITY, GET_ALL_CITY, UPDATE_CITY } from "../../actions/Master/City.action";


const initialState = {
    createCity: "",
    updateCity: "",
    getAllCity: "",
    deleteCity: "",
    cityDropDown: "",
};

export const cityReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_CITY:
            return { ...state, createCity: action.payload };
        case UPDATE_CITY:
            return { ...state, updateCity: action.payload };
        case GET_ALL_CITY:
            return { ...state, getAllCity: action.payload };
        case DELETE_CITY:
            return { ...state, deleteCity: action.payload };
        case CITY_DROPDOWN:
            return { ...state, cityDropDown: action.payload };
        default:
            return state; 
    }
}