import { CREATE_TAG, DELETE_TAG, GET_ALL_TAG, UPDATE_TAG } from "../../actions/Master/Tag.action";

const initialState = {
    createTag:"",
    updateTag:"",
    getAllTag:"",
    deleteTag:""
}

export const TagReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TAG:
      return { ...state, createTag: action.payload };
    case UPDATE_TAG:
      return { ...state, updateTag: action.payload };
    case GET_ALL_TAG:
      return { ...state, getAllTag: action.payload };
    case DELETE_TAG:
      return { ...state, deleteTag: action.payload };
    default:
      return state;
  }
}