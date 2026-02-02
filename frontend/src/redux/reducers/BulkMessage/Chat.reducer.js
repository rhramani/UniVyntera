import { SEND_MESSAGE, GET_HISTORY, APPEND_MESSAGE, UPDATE_MESSAGE_STATUS } from '../../actions/BulkMessage/Chat.action';

const initialState = {
  sendMessage: null, // Can be removed if not used
  history: {
    messages: [],
  },
};

const ChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        sendMessage: action.payload,
      };
    case GET_HISTORY:
      return {
        ...state,
        history: {
          messages: action.payload?.messages || [], // Ensure messages is an array
        },
      };
    case APPEND_MESSAGE:
      return {
        ...state,
        history: {
          ...state.history,
          messages: [...(state.history?.messages || []), action.payload],
        },
      };
    case UPDATE_MESSAGE_STATUS:
      return {
        ...state,
        history: {
          ...state.history,
          messages: (state.history?.messages || []).map((msg) =>
            msg.messageId === action.payload.messageId
              ? {
                  ...msg,
                  status: action.payload.status,
                  timestamp: action.payload.timestamp,
                }
              : msg,
          ),
        },
      };
    default:
      return state;
  }
};

export default ChatReducer;