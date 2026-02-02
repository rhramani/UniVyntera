import axios from "axios";
import { BASEURL } from "../../../baseUrl";
import { toast } from "react-toastify";
import { getChatContacts } from "./Contact.action";

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_HISTORY = 'GET_HISTORY';
export const APPEND_MESSAGE = "APPEND_MESSAGE";
export const UPDATE_MESSAGE_STATUS = "UPDATE_MESSAGE_STATUS";

export const sendMessageAction = (payload) => ({ type: SEND_MESSAGE, payload });
export const getHistoryAction = (payload) => ({ type: GET_HISTORY, payload });
export const appendMessage = (msg) => ({ type: APPEND_MESSAGE, payload: msg });
export const updateMessageStatus = ({ messageId, status, timestamp }) => ({
  type: UPDATE_MESSAGE_STATUS,
  payload: { messageId, status, timestamp },
});

export const sendMessage = (payload) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${BASEURL}/waDaddy/message/send`, payload, config);
      // Dispatch the sent message to append it immediately
      const { data } = response.data; // Assuming response.data has { success, message, data }
      return response.data; // Return for handling in component
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      throw error; // Let the component handle the error
    }
  };
};

export const getHistory = (phoneNumber) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASEURL}/waDaddy/message?phoneNumber=${phoneNumber}`, config);
      console.log("response", response?.data);
      dispatch(getHistoryAction(response.data));
      dispatch(getChatContacts());
      return response?.data;
    } catch (error) {
      console.error("Error getting history:", error);
      toast.error("Failed to get history");
    }
  };
};