    import {
    CREATE_OTHER,
    UPDATE_OTHER,
    GET_ALL_OTHER,
    DELETE_OTHER,
} from "../../actions/Master/OtherService.action";

const initialState = {
  CreateOther: "",
  UpdateOther: "",
  GetAllOther: "",
  DeleteOther: "",
};

export const otherReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_OTHER:
      return { ...state, CreateOther: action.payload };
    case UPDATE_OTHER:
      return { ...state, UpdateOther: action.payload };
    case GET_ALL_OTHER:
      return { ...state, GetAllOther: action.payload };
    case DELETE_OTHER:
      return { ...state, DeleteOther: action.payload };
    default:
      return state;
  }
};
