import {
  CREATE_CREDENTIAL,
  GET_ALL_CREDENTIAL,
  UPDATE_CREDENTIAL,
} from "../../actions/BulkMessage/Credential.action";

const initialState = {
  createCredential: "",
  updateCredential: "",
  getAllCredential: "",
};

export const credentialReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CREDENTIAL:
      return { ...state, createCredential: action.payload };
    case UPDATE_CREDENTIAL:
      return { ...state, updateCredential: action.payload };
    case GET_ALL_CREDENTIAL:
      return { ...state, getAllCredential: action.payload };
    default:
      return state;
  }
};
