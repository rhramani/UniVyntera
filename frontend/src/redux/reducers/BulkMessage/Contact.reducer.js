import {
  ADD_CONTACT,
  DELETE_CONTACT,
  GET_ALL_CONTACTS,
  GET_ALL_EXPORTS_CONTACTS,
  IMPORT_BULK_CONTACT,
  MULTI_DELETE_CONTACT,
  UNSUBSCRIBED_CONATCT,
  UPDATE_CONTACT,
  GET_CHAT_CONTACTS,
} from "../../actions/BulkMessage/Contact.action";

const initialState = {
  getContact: "",
  addContact: "",
  getAllContacts: [],
  getAllExportContacts: [],
  updateContact: "",
  deleteContact: "",
  multiDeleteConstact: "",
  unsubscribedContact: "",
  bulkImport: "",
  chatContact: "",
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONTACT:
      return { ...state, addContact: action.payload };
    case GET_ALL_CONTACTS:
      return { ...state, getAllContacts: action.payload };
    case GET_ALL_EXPORTS_CONTACTS:
      return { ...state, getAllExportContacts: action.payload };
    case GET_CONTACT:
      return { ...state, getContact: action.payload };
    case UPDATE_CONTACT:
      return { ...state, updateContact: action.payload };
    case DELETE_CONTACT:
      return { ...state, deleteContact: action.payload };
    case MULTI_DELETE_CONTACT:
      return { ...state, deleteContact: action.payload };
    case UNSUBSCRIBED_CONATCT:
      return { ...state, deleteContact: action.payload };
    case IMPORT_BULK_CONTACT:
      return { ...state, bulkImport: action.payload };
    case GET_CHAT_CONTACTS:
      return { ...state, chatContact: action.payload };
    default:
      return state;
  }
};
export default contactReducer;
