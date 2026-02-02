import { DELETE_CONTACT } from "../../actions/BulkMessage/Contact.action";
import { ADD_BULK_CONTACT, ADD_CONTACT, DELETE_GROUP, GET_ALL_GROUPS, GET_GROUP_BY_ID, LIST_GROUP_CONTACT } from "../../actions/BulkMessage/Group.action";

const initialState = {
  getAllGroup: "",
  createGroup: "",
  addContact: "",
  addBulkContact: "",
  deleteContact: "",
  deleteGroup: "",
  listGroupContact: "",
  getGroupById: {},
};

const groupReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_GROUPS:
      return { ...state, getAllGroup: action.payload };
    case ADD_CONTACT:
      return { ...state, addContact: action.payload };
    case ADD_BULK_CONTACT:
      return { ...state, addBulkContact: action.payload };
    case DELETE_CONTACT:
      return { ...state, deleteContact: action.payload };
    case DELETE_GROUP:
      return { ...state, deleteGroup: action.payload };
    case LIST_GROUP_CONTACT:
      return { ...state, listGroupContact: action.payload };
    case GET_GROUP_BY_ID:
      return { ...state, getGroupById: action.payload };
    default:
      return state;
  }
};

export default groupReducers;
