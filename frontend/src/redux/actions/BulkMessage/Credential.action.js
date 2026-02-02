import Axios from "../../../api";
import {
  createCredentialUrl,
  getAllCredentialUrl,
  updateCredentialUrl,
} from "../../routes/BulkMessage/Credential.route";

export const CREATE_CREDENTIAL = "CREATE_CREDENTIAL";
export const GET_ALL_CREDENTIAL = "GET_ALL_CREDENTIAL";
export const UPDATE_CREDENTIAL = "UPDATE_CREDENTIAL";

const createCredentialAction = (payload) => ({
  type: CREATE_CREDENTIAL,
  payload,
});

const getAllCredentialAction = (payload) => ({
  type: GET_ALL_CREDENTIAL,
  payload,
});

const updateCredentialAction = (payload) => ({
  type: UPDATE_CREDENTIAL,
  payload,
});

export const createCredential = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createCredentialUrl}`, payload);
      dispatch(createCredentialAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in createCredential", error);
      throw error;
    }
  };
};

export const updateCredential = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCredentialUrl}/${id}`, payload);
      dispatch(updateCredentialAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in updateCredential", error);
      throw error;
    }
  };
};

export const getAllCredential = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllCredentialUrl}`);
      dispatch(getAllCredentialAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAllCredential", error);
      throw error;
    }
  };
};
