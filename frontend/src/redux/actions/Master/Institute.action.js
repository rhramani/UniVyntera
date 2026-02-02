import Axios from "../../../api.js";
import { cityDropDownUrl, countryDropDownUrl, createDirectInstituteUrl, createInstituteUrl, deleteDirectInstituteUrl, deleteInstituteUrl, getAllDirectInstituteUrl, getAllInstituteUrl, getByIdDirectInstituteUrl, getByIdInstituteUrl, instituteWiseCampusDropDownUrl, instituteWiseCountryDropDownUrl, instituteWiseProgramlevelDropDownUrl, stateDropDownUrl, universityCountryDropDownUrl, updateDirectInstituteUrl, updateInstituteUrl } from "../../routes/Master/Institute.route";


export const CREATE_INSTITUTE = "CREATE_INSTITUTE";
export const UPDATE_INSTITUTE = "UPDATE_INSTITUTE";
export const GET_BY_ID_INSTITUTE = "GET_BY_ID_INSTITUTE";
export const GET_ALL_INSTITUTE = "GET_ALL_INSTITUTE";
export const DELETE_INSTITUTE = "DELETE_INSTITUTE";
export const COUNTRY_DROPDOWN = "COUNTRY_DROPDOWN";
export const STATE_DROPDOWN = "STATE_DROPDOWN";
export const CITY_DROPDOWN = "CITY_DROPDOWN";
export const UNIVERSITY_COUNTRY_DROPDOWN = "UNIVERSITY_COUNTRY_DROPDOWN";
export const INSTITUTE_WISE_COUNTRY_DROPDOWN = "INSTITUTE_WISE_COUNTRY_DROPDOWN";
export const INSTITUTE_WISE_CAMPUS_DROPDOWN = "INSTITUTE_WISE_CAMPUS_DROPDOWN";
export const INSTITUTE_WISE_PROGRAM_LEVEL_DROPDOWN = "INSTITUTE_WISE_PROGRAM_LEVEL_DROPDOWN";

// Direct Institute

export const CREATE_DIRECT_INSTITUTE = "CREATE_DIRECT_INSTITUTE";
export const UPDATE_DIRECT_INSTITUTE = "UPDATE_DIRECT_INSTITUTE";
export const GET_ALL_DIRECT_INSTITUTE = "GET_ALL_DIRECT_INSTITUTE";
export const DELETE_DIRECT_INSTITUTE = "DELETE_DIRECT_INSTITUTE";
export const GET_BY_ID_DIRECT_INSTITUTE = "GET_BY_ID_DIRECT_INSTITUTE";

const createInstituteAction = (payload) => ({ type: CREATE_INSTITUTE, payload });
const updateInstituteAction = (payload) => ({ type: UPDATE_INSTITUTE, payload });
const getInstituteByIdAction = (payload) => ({ type: GET_BY_ID_INSTITUTE, payload });
const getAllInstituteAction = (payload) => ({ type: GET_ALL_INSTITUTE, payload });
const deleteInstituteAction = (payload) => ({ type: DELETE_INSTITUTE, payload });
const countryDropdownAction = (payload) => ({ type: COUNTRY_DROPDOWN, payload });
const stateDropdownAction = (payload) => ({ type: STATE_DROPDOWN, payload });
const cityDropdownAction = (payload) => ({ type: CITY_DROPDOWN, payload });
const universityCountryDropdownAction = (payload) => ({ type: UNIVERSITY_COUNTRY_DROPDOWN, payload });
const instituteWiseCountryDropdownAction = (payload) => ({ type: INSTITUTE_WISE_COUNTRY_DROPDOWN, payload });
const instituteWiseCampusDropdownAction = (payload) => ({ type: INSTITUTE_WISE_CAMPUS_DROPDOWN, payload });
const instituteWiseProgramLevelDropdownAction = (payload) => ({ type: INSTITUTE_WISE_PROGRAM_LEVEL_DROPDOWN, payload });

// Direct Institute

const createDirectInstituteAction = (payload) => ({ type: CREATE_DIRECT_INSTITUTE, payload });
const updateDirectInstituteAction = (payload) => ({ type: UPDATE_DIRECT_INSTITUTE, payload });
const getAllDirectInstituteAction = (payload) => ({ type: GET_ALL_DIRECT_INSTITUTE, payload });
const deleteDirectInstituteAction = (payload) => ({ type: DELETE_DIRECT_INSTITUTE, payload });
const getByIdDirectInstituteAction = (payload) => ({ type: GET_BY_ID_DIRECT_INSTITUTE, payload });

export const createInstitute = (payload) => async (dispatch) => {
    try {
        const res = await Axios.post(createInstituteUrl, payload);
        dispatch(createInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in creating institute:", error);
        throw error;
    }
};

export const updateInstitute = (payload, id) => async (dispatch) => {
    try {
        const res = await Axios.put(`${updateInstituteUrl}/${id}`, payload);
        dispatch(updateInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in updating institute: ", error);
        throw error;
    }
};

export const getByIdInstitute = (id) => async (dispatch) => {
    try {
        const res = await Axios.get(`${getByIdInstituteUrl}/${id}`);
        dispatch(getInstituteByIdAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting institute by id: ", error);
        throw error;
    }
};

export const getAllInstitute = (page = 1, limit = 10, search = "", country = "", state = "") => async (dispatch) => {
    try {
        const res = await Axios.get(`${getAllInstituteUrl}?page=${page}&limit=${limit}&search=${search}&country=${country}&state=${state}`);
        dispatch(getAllInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting all institute: ", error);
        throw error;
    }
}

export const deleteInstitute = (id) => async (dispatch) => {
    try {
        const res = await Axios.delete(`${deleteInstituteUrl}/${id}`);
        dispatch(deleteInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in deleting institute: ", error);
        throw error;
    }
}

export const countryDropdown = () => async (dispatch) => {
    try {
        const res = await Axios.get(`${countryDropDownUrl}`);
        dispatch(countryDropdownAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting country dropdown: ", error);
        throw error;
    }
}

export const stateDropdown = (country) => async (dispatch) => {
    try {
        const res = await Axios.get(`${stateDropDownUrl}?country=${country}`);
        dispatch(stateDropdownAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting state dropdown: ", error);
        throw error;
    }
}
export const cityDropdown = (country, state) => async (dispatch) => {
    try {
        const res = await Axios.get(`${cityDropDownUrl}?country=${country}&state=${state}`);
        dispatch(cityDropdownAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting city dropdown: ", error);
        throw error;
    }
}

export const universityCountryDropdown = () => async (dispatch) => {
    try {
        const res = await Axios.get(`${universityCountryDropDownUrl}`);
        dispatch(universityCountryDropdownAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting university country dropdown: ", error);
        throw error;
    }
}

export const instituteWiseCountryDropdown = (instituteName) => async (dispatch) => {
    try {
        const res = await Axios.get(`${instituteWiseCountryDropDownUrl}?instituteName=${instituteName}`);
        dispatch(instituteWiseCountryDropdownAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting institute wise country dropdown: ", error);
        throw error;
    }
}
export const instituteWiseCampusDropdown = (instituteName, country) => async (dispatch) => {
    try {
        const res = await Axios.get(`${instituteWiseCampusDropDownUrl}?instituteName=${instituteName}&country=${country}`);
        dispatch(instituteWiseCampusDropdownAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting institute wise campus dropdown: ", error);
        throw error;
    }
}
export const instituteWiseProgramLevelDropdown = (instituteName, prefferedCountry) => async (dispatch) => {
    try {
        const res = await Axios.get(`${instituteWiseProgramlevelDropDownUrl}?instituteName=${instituteName}&country=${prefferedCountry}`);
        dispatch(instituteWiseProgramLevelDropdownAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting institute wise Program Level dropdown: ", error);
        throw error;
    }
}

// Direct Institute

export const createDirectInstitute = (payload) => async (dispatch) => {
    try {
        const res = await Axios.post(createDirectInstituteUrl, payload);
        dispatch(createDirectInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in creating direct institute: ", error);
        throw error;
    }
};

export const updateDirectInstitute = (payload, id) => async (dispatch) => {
    try {
        const res = await Axios.put(`${updateDirectInstituteUrl}/${id}`, payload);
        dispatch(updateDirectInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in updating direct institute: ", error);
        throw error;
    }
};

export const getAllDirectInstitute = (page = 1, limit = 10, search = "", status = "", country = "", state = "") => async (dispatch) => {
    try {
                const res = await Axios.get(`${getAllDirectInstituteUrl}?page=${page}&limit=${limit}&search=${search}&status=${status}&country=${country}&state=${state}`);

        dispatch(getAllDirectInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting all direct institute: ", error);
        throw error;
    }
};

export const deleteDirectInstitute = (id) => async (dispatch) => {
    try {
        const res = await Axios.delete(`${deleteDirectInstituteUrl}/${id}`);
        dispatch(deleteDirectInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in deleting direct institute: ", error);
        throw error;
    }
};

export const getByIdDirectInstitute = (id) => async (dispatch) => {
    try {
        const res = await Axios.get(`${getByIdDirectInstituteUrl}/${id}`);
        dispatch(getByIdDirectInstituteAction(res.data));
        return res;
    } catch (error) {
        console.error("Error fetching in getting by id direct institute: ", error);
        throw error;
    }
};