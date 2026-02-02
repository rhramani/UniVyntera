import {
  CREATE_BRANCH,
  DELETE_BRANCH,
  GET_ALL_BRANCH,
  GET_ONE_BRANCH,
  UPDATE_BRANCH,
} from "../actions/Branch.action";

const initialState = {
  createBranch: "",
  updateBranch: "",
  getOneBranch: "",
  getAllBranch: "",
  deleteBranch: "",
};

export const branchReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BRANCH:
      return { ...state, createBranch: action.payload };
    case UPDATE_BRANCH:
      return { ...state, updateBranch: action.payload };
    case GET_ONE_BRANCH:
      return { ...state, getOneBranch: action.payload };
    case GET_ALL_BRANCH:
      return { ...state, getAllBranch: action.payload };
    case DELETE_BRANCH:
      return { ...state, deleteBranch: action.payload };
    default:
      return state;
  }
};
