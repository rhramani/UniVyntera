import Axios from "../../api.js";
import { b2BMemberCreateUrl, b2BMemberDeleteUrl, b2BMemberGetAllUrl, b2BMemberGetByB2BAdminUrl, b2BMemberGetOneUrl, b2BMemberUpdateUrl } from "../routes/B2BMember.route";

export const CREATE_B2B_MEMBER = "CREATE_B2B_MEMBER";
export const UPDATE_B2B_MEMBER = "UPDATE_B2B_MEMBER";
export const GET_ONE_B2B_MEMBER = "GET_ONE_B2B_MEMBER";
export const GET_ALL_B2B_MEMBER = "GET_ALL_B2B_MEMBER";
export const DELETE_B2B_MEMBER = "DELETE_B2B_MEMBER";
export const B2B_MEMBER_GET_BY_B2B_ADMIN = "B2B_MEMBER_GET_BY_B2B_ADMIN";

const createB2BMemberAction = (data) => ({
  type: CREATE_B2B_MEMBER,
  payload: data,
});
const updateB2BMemberAction = (data) => ({
  type: UPDATE_B2B_MEMBER,
  payload: data,
});
const getB2BMemberByIdAction = (data) => ({
  type: GET_ONE_B2B_MEMBER,
  payload: data,
});
const getAllB2BMembersAction = (data) => ({
  type: GET_ALL_B2B_MEMBER,
  payload: data,
});
const deleteB2BMembersAction = (data) => ({
  type: DELETE_B2B_MEMBER,
  payload: data,
});

const getB2BMemberByB2BAdminAction = (data) => ({
  type: B2B_MEMBER_GET_BY_B2B_ADMIN,
  payload: data,
})

export const createB2BMember = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${b2BMemberCreateUrl}`, payload);
      dispatch(createB2BMemberAction(res.data));
      console.log("res.datares.datares.datares.data", res.data);
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const updateB2BMember = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${b2BMemberUpdateUrl}/${id}`, payload);
      dispatch(updateB2BMemberAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const getB2BMemberById = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${b2BMemberGetOneUrl}/${id}`);
      dispatch(getB2BMemberByIdAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const getAllB2BMembers = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${b2BMemberGetAllUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllB2BMembersAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };    
}

export const deleteB2BMember = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${b2BMemberDeleteUrl}/${id}`);
      dispatch(deleteB2BMembersAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };    
}

export const getB2BMemberByB2BAdmin = (page = 1, limit = 10, search = "", id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${b2BMemberGetByB2BAdminUrl}/${id}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getB2BMemberByB2BAdminAction(res.data));
      return res;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };    
}