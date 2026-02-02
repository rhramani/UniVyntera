import {
  CREATE_FOLLOW_UP_TYPE,
  DELETE_FOLLOW_UP_TYPE,
  GET_ALL_FOLLOW_UP_TYPE,
  UPDATE_FOLLOW_UP_TYPE,
} from "../../actions/Lead/FollowUpType.action";

const initialState = {
  CreateFollowUpType: "",
  UpdateFollowUpType: "",
  GetAllFollowUpType: "",
  DeleteFollowUpType: "",
};

export const degreeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_FOLLOW_UP_TYPE:
      return { ...state, CreateFollowUpType: action.payload };
    case UPDATE_FOLLOW_UP_TYPE:
      return { ...state, UpdateFollowUpType: action.payload };
    case GET_ALL_FOLLOW_UP_TYPE:
      return { ...state, GetAllFollowUpType: action.payload };
    case DELETE_FOLLOW_UP_TYPE:
      return { ...state, DeleteFollowUpType: action.payload };
    default:
      return state;
  }
};
