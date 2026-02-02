import {
  CREATE_MAIN_PLAN,
  DELETE_MAIN_PLAN,
  GETALL_MAIN_PLAN,
  UPDATE_MAIN_PLAN,
} from "../../actions/Master/MainPlan.action";

const initialState = {
  createMainPlan: "",
  updateMainPlan: "",
  getAllMainPlan: "",
  deleteMainPlan: "",
};

export const mainPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MAIN_PLAN:
      return { ...state, CreateMainPlan: action.payload };
    case UPDATE_MAIN_PLAN:
      return { ...state, CreateMainPlan: action.payload };
    case GETALL_MAIN_PLAN:
      return { ...state, CreateMainPlan: action.payload };
    case DELETE_MAIN_PLAN:
      return { ...state, CreateMainPlan: action.payload };
    default:
      return state;
  }
};
