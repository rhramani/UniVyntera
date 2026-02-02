import { CREATE_STATE, DELETE_STATE, GET_ALL_STATE, STATE_DROPDOWN, UPDATE_STATE } from "../../actions/Master/State.action";

const initialState = {
    CreateState: "",
    UpdateState: "",
    GetAllState: "",
    DeleteState: "",
    StateDropDown: "",
  };
  
  export const stateReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_STATE:
        return { ...state, CreateState: action.payload };
        case UPDATE_STATE:
        return { ...state, UpdateState: action.payload };
        case GET_ALL_STATE:
        return { ...state, GetAllState: action.payload };
        case DELETE_STATE:
        return { ...state, DeleteState: action.payload };
        case STATE_DROPDOWN:
        return { ...state, StateDropDown: action.payload };
      default:
        return state;
    }
  };