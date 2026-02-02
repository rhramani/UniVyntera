import {
  CREATE_STREAM,
  DELETE_STREAM,
  GET_ALL_STREAM,
  UPDATE_STREAM,
} from "../../actions/Master/Stream.action";

const initialState = {
  CreateStream: "",
  UpdateStream: "",
  GetAllStream: "",
  DeleteStream: "",
};

export const streamReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_STREAM:
      return { ...state, CreateStream: action.payload };
    case UPDATE_STREAM:
      return { ...state, UpdateStream: action.payload };
    case GET_ALL_STREAM:
      return { ...state, GetAllStream: action.payload };
    case DELETE_STREAM:
      return { ...state, DeleteStream: action.payload };
    default:
      return state;
  }
};
