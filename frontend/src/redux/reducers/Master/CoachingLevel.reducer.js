import {
  CREATE_LEVEL,
  DELETE_LEVEL,
  GET_ALL_LEVEL,
  UPDATE_LEVEL,
} from "../../actions/Master/CoachingLevel.action";

const initialState = {
  CreateLevel: "",
  UpdateLevel: "",
  GetAllLevel: "",
  DeleteLevel: "",
};

export const levelReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LEVEL:
      return { ...state, CreateLevel: action.payload };
    case UPDATE_LEVEL:
      return { ...state, UpdateLevel: action.payload };
    case GET_ALL_LEVEL:
      return { ...state, GetAllLevel: action.payload };
    case DELETE_LEVEL:
      return { ...state, DeleteLevel: action.payload };
    default:
      return state;
  }
};
