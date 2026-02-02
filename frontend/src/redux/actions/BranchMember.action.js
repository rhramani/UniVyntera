import Axios from "../../api.js";
import { branchMemberCreateUrl, branchMemberDeleteUrl, branchMemberGetAllUrl, branchMemberGetByB2BAdminUrl, branchMemberGetOneUrl, branchMemberUpdateUrl } from "../routes/BranchMember.route.js";

export const CREATE_BRANCH_MEMBER = "CREATE_BRANCH_MEMBER";
export const UPDATE_BRANCH_MEMBER = "UPDATE_BRANCH_MEMBER";
export const GET_ONE_BRANCH_MEMBER = "GET_ONE_BRANCH_MEMBER";
export const GET_ALL_BRANCH_MEMBER = "GET_ALL_BRANCH_MEMBER";
export const DELETE_BRANCH_MEMBER = "DELETE_BRANCH_MEMBER";
export const BRANCH_MEMBER_GET_BY_BRANCH = "BRANCH_MEMBER_GET_BY_BRANCH";

const createBranchMemberAction = (data) => ({
  type: CREATE_BRANCH_MEMBER,
  payload: data,
});
const updateBranchMemberAction = (data) => ({
  type: UPDATE_BRANCH_MEMBER,
  payload: data,
});
const getBranchMemberByIdAction = (data) => ({
  type: GET_ONE_BRANCH_MEMBER,
  payload: data,
});
const getAllBranchMembersAction = (data) => ({
  type: GET_ALL_BRANCH_MEMBER,
  payload: data,
});
const deleteBranchMembersAction = (data) => ({
  type: DELETE_BRANCH_MEMBER,
  payload: data,
});

const getBranchMemberByBranchAction = (data) => ({
  type: BRANCH_MEMBER_GET_BY_BRANCH,
  payload: data,
})

export const createBranchMember = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${branchMemberCreateUrl}`, payload);
      dispatch(createBranchMemberAction(res.data));
      return res;
    } catch (error) {
      console.error("Create branch member API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const updateBranchMember = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${branchMemberUpdateUrl}/${id}`, payload);
      dispatch(updateBranchMemberAction(res.data));
      return res;
    } catch (error) {
      console.error("Update branch member API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const getBranchMemberById = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${branchMemberGetOneUrl}/${id}`);
      dispatch(getBranchMemberByIdAction(res.data));
      return res;
    } catch (error) {
      console.error("Get branch member API Error:", error.response?.data || error.message);
      throw error;
    }
  };
};

export const getAllBranchMembers = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${branchMemberGetAllUrl}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getAllBranchMembersAction(res.data));
      return res;
    } catch (error) {
      console.error("Get all branch members API Error:", error.response?.data || error.message);
      throw error;
    }
  };    
}

export const deleteBranchMember = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${branchMemberDeleteUrl}/${id}`);
      dispatch(deleteBranchMembersAction(res.data));
      return res;
    } catch (error) {
      console.error("Delete branch member API Error:", error.response?.data || error.message);
      throw error;
    }
  };    
}

export const getBranchMemberByBranch = (page = 1, limit = 10, search = "", id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${branchMemberGetByB2BAdminUrl}/${id}?page=${page}&limit=${limit}&search=${search}`);
      dispatch(getBranchMemberByBranchAction(res.data));
      return res;
    } catch (error) {
      console.error("Get branch member by branch API Error:", error.response?.data || error.message);
      throw error;
    }
  };    
}