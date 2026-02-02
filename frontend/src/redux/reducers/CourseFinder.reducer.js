import { BULK_UPLOAD, COUNTRY_DROPDOWN, COURSE_DOWNLOAD_EXCEL, CREATE_COURSE_FINDER, CURRENCY_CODE, DELETE_COURSE_FINDER, DURATION_DROPDOWN, GET_ALL_COURSE_FINDER, GET_DEPENDENT_FILTER, UPDATE_COURSE_FINDER, GET_STUDY_AREA } from "../actions/CourseFinder.action";

const initialState = {
    createCourseFinder:'',
    updateCourseFinder:'',
    getAllCourseFinder:'',
    deleteCourseFinder:'',
    courseDownloadExcel:'',
    bulkUpload:'',
    currencyCode:'',
    countryDropDown:'',
    durationDropDown:'',
    getDependentFilter: '',
    getStudyArea: '',
}

export const createCourseFinderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_COURSE_FINDER:
            return {...state, createCourseFinder:action.payload};
        case UPDATE_COURSE_FINDER:
            return {...state, updateCourseFinder:action.payload};
        case GET_ALL_COURSE_FINDER:
            return {...state, getAllCourseFinder:action.payload};
        case DELETE_COURSE_FINDER:
            return {...state, deleteCourseFinder:action.payload};  
        case COURSE_DOWNLOAD_EXCEL:
            return {...state, courseDownloadExcel:action.payload};  
        case BULK_UPLOAD:
            return {...state, bulkUpload:action.payload};
        case CURRENCY_CODE:
            return {...state, currencyCode:action.payload};
        case COUNTRY_DROPDOWN:
            return {...state, countryDropDown:action.payload};
        case DURATION_DROPDOWN:
            return {...state, durationDropDown:action.payload};
        case GET_DEPENDENT_FILTER:
            return {...state, getDependentFilter:action.payload};
        case GET_STUDY_AREA:
            return {...state, getStudyArea:action.payload};
        default:
            return state;    
    }
}
