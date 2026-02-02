import {
  CREATE_ROLE,
  DELETE_ROLE,
  GET_ALL_ROLE,
  GET_ONE_ROLE,
  UPDATE_ROLE,
  GET_ALL_ROLE_LIST,
} from "../../actions/Master/Role.action";

const initialState = {
  createRole: "",
  updateRole: "",
  getAllRole: "",
  deleteRole: "",
  getRoleById: "",
  getAllRoleUrlWithoutPagination: "",
};

export const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ROLE:
      return { ...state, createRole: action.payload };
    case UPDATE_ROLE:
      return { ...state, updateRole: action.payload };
    case GET_ALL_ROLE:
      return { ...state, getAllRole: action.payload };
    case DELETE_ROLE:
      return { ...state, deleteRole: action.payload };
    case GET_ONE_ROLE:
      return { ...state, getRoleById: action.payload };
    case GET_ALL_ROLE_LIST:
      return { ...state, getRoleById: action.getAllRoleUrlWithoutPagination };
    default:
      return state;
  }
};
