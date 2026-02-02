import {
  CREATE_PROGRESSBAR,
  DELETE_PROGRESSBAR,
  GET_ALL_PROGRESSBAR,
} from "../../actions/Master/Progressbar.action";

const initialState = {
  createProgressbar: "",
  getAllProgressbar: "",
  deleteProgressbar: "",
};

export const progressbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PROGRESSBAR:
      return { ...state, createProgressbar: action.payload };
    case GET_ALL_PROGRESSBAR:
      return { ...state, createProgressbar: action.payload };
    case DELETE_PROGRESSBAR:
      return { ...state, createProgressbar: action.payload };
    default:
      return state;
  }
};
