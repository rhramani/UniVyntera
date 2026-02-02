import {
  CREATE_SUB_PLAN,
  DELETE_SUB_PLAN,
  GETALL_SUB_PLAN,
  UPDATE_SUB_PLAN,
} from "../../actions/Master/SubPlan.action";

const initialState = {
  createSubPlan: "",
  updateSubPlan: "",
  getAllSubPlan: "",
  deleteSubPlan: "",
};

export const mainPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SUB_PLAN:
      return { ...state, CreateSubPlan: action.payload };
    case UPDATE_SUB_PLAN:
      return { ...state, CreateSubPlan: action.payload };
    case GETALL_SUB_PLAN:
      return { ...state, CreateSubPlan: action.payload };
    case DELETE_SUB_PLAN:
      return { ...state, CreateSubPlan: action.payload };
    default:
      return state;
  }
};
