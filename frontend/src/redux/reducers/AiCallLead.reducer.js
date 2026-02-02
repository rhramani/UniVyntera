import {
  CREATE_AI_CALL_LEAD,
  DELETE_AI_CALL_LEAD,
  GET_ALL_AI_CALL_LEAD,
  GET_ONE_AI_CALL_LEAD,
  UPDATE_AI_CALL_LEAD,
} from "../actions/AiCallLead.action";

const initialState = {
  createAiCallLead: "",
  updateAiCallLead: "",
  getAllAiCallLead: "",
  getOneAiCallLead: "",
  deleteAiCallLead: "",
};

export const createAiCallLeadReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_AI_CALL_LEAD:
      return { ...state, createAiCallLead: action.payload };
    case UPDATE_AI_CALL_LEAD:
      return { ...state, updateAiCallLead: action.payload };
    case GET_ALL_AI_CALL_LEAD:
      return { ...state, getAllAiCallLead: action.payload };
    case GET_ONE_AI_CALL_LEAD:
      return { ...state, getOneAiCallLead: action.payload };
    case DELETE_AI_CALL_LEAD:
      return { ...state, deleteAiCallLead: action.payload };
    default:
      return state;
  }
};
