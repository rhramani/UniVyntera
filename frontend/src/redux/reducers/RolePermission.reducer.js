import {
  CREATE_ROLE_PERMISSION,
  GET_ALL_ROLE_PERMISSION,
  GET_ONE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,
} from "../actions/RolePermission.action";

const initialState = {
  createRolePermission: "",
  updateRolePermission: "",
  getAllRolePermission: "",
  getOneRolePermission: "",
};

export const rolePermissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ROLE_PERMISSION:
      return { ...state, createRolePermission: action.payload };
    case UPDATE_ROLE_PERMISSION:
      return { ...state, updateRolePermission: action.payload };
    case GET_ALL_ROLE_PERMISSION:
      return { ...state, getAllRolePermission: action.payload };
    case GET_ONE_ROLE_PERMISSION:
      return { ...state, getOneRolePermission: action.payload };
    default:
      return state;
  }
};
