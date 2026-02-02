import {
  CREATE_TUTORIAL,
  DELETE_TUTORIAL,
  GET_ALL_TUTORIAL,
  UPDATE_TUTORIAL,
  GET_ONE_TUTORIAL,
} from "../actions/Tutorial.action";

const initialState = {
  createTutorial: "",
  updateTutorial: "",
  getAllTutorial: "",
  deleteTutorial: "",
  getOneTutorial: "",
};

export const TutorialReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TUTORIAL:
      return { ...state, createTutorial: action.payload };
    case UPDATE_TUTORIAL:
      return { ...state, updateTutorial: action.payload };
    case GET_ALL_TUTORIAL:
      return { ...state, getAllTutorial: action.payload };
    case DELETE_TUTORIAL:
      return { ...state, deleteTutorial: action.payload };
    case GET_ONE_TUTORIAL:
      return { ...state, getOneTutorial: action.payload };
    default:
      return state;
  }
};
