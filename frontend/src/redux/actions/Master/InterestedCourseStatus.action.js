import Axios from "../../../api";
import { createInterestedCourseStatusUrl, deleteInterestedCourseStatusUrl, getAllInterestedCourseStatusUrl, getOneInterestedCourseStatusUrl, updateInterestedCourseStatusUrl } from "../../routes/Master/InterestedCourseStatus.route";

export const CREATE_INTERESTED_COURSE_STATUS = "CREATE_INTERESTED_COURSE_STATUS";
export const UPDATE_INTERESTED_COURSE_STATUS = "UPDATE_INTERESTED_COURSE_STATUS";
export const GET_ONE_INTERESTED_COURSE_STATUS = "GET_ONE_INTERESTED_COURSE_STATUS";
export const GET_ALL_INTERESTED_COURSE_STATUS = "GET_ALL_INTERESTED_COURSE_STATUS";
export const DELETE_INTERESTED_COURSE_STATUS = "DELETE_INTERESTED_COURSE_STATUS";

const createInterestedCourseStatusAction = (payload) => ({ type: CREATE_INTERESTED_COURSE_STATUS, payload });
const updateInterestedCourseStatusAction = (payload) => ({ type: UPDATE_INTERESTED_COURSE_STATUS, payload });
const getOneInterestedCourseStatusAction = (payload) => ({ type: GET_ONE_INTERESTED_COURSE_STATUS, payload });
const getAllInterestedCourseStatusAction = (payload) => ({ type: GET_ALL_INTERESTED_COURSE_STATUS, payload });
const deleteInterestedCourseStatusAction = (payload) => ({ type: DELETE_INTERESTED_COURSE_STATUS, payload });

export const createInterestedCourseStatus = (payload) => {
    return async (dispatch) => {
        try {
            const res = await Axios.post(`${createInterestedCourseStatusUrl}`, payload);
            dispatch(createInterestedCourseStatusAction(res.data));
            return res;
        } catch (error) {
            console.log("Error fetching in create interested status", error);
            throw error;
        }
    }
}

export const updateInterestedCourseStatus = (payload, id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.put(`${updateInterestedCourseStatusUrl}/${id}`, payload);
            dispatch(updateInterestedCourseStatusAction(res.data));
            return res;
        } catch (error) {
            console.log("Error fetching in update interested status", error);
            throw error;
        }
    }
}

export const getOneInterestedCourseStatus = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getOneInterestedCourseStatusUrl}/${id}`);
            dispatch(getOneInterestedCourseStatusAction(res.data));
            return res;
        } catch (error) {
            console.log("Error fetching in getOne interested status", error);
            throw error;
        }
    }
}

export const getAllInterestedCourseStatus = (search) => {
    return async (dispatch) => {
        try {
            const res = await Axios.get(`${getAllInterestedCourseStatusUrl}?search=${search}`);
            dispatch(getAllInterestedCourseStatusAction(res.data));
            return res;
        } catch (error) {
            console.log("Error fetching in getAll interested status", error);
            throw error;
        }
    }
}

export const deleteInterestedCourseStatus = (id) => {
    return async (dispatch) => {
        try {
            const res = await Axios.delete(`${deleteInterestedCourseStatusUrl}/${id}`);
            dispatch(deleteInterestedCourseStatusAction(res.data));
            return res;
        } catch (error) {
            console.log("Error fetching in delete interested status", error);
            throw error;
        }
    }
}