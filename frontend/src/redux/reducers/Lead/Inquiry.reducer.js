import {
    CREATE_INQUIRY,
    UPDATE_INQUIRY,
    GET_ALL_INQUIRY,
    DELETE_INQUIRY,
} from "../../actions/Lead/Inquiry.action";

const initialState = {
  CreateInquiry: "",
  UpdateInquiry: "",
  GetAllInquiry: "",
  DeleteInquiry: "",
};

export const inquiryReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_INQUIRY:
      return { ...state, CreateInquiry: action.payload };
    case UPDATE_INQUIRY:
      return { ...state, UpdateInquiry: action.payload };
    case GET_ALL_INQUIRY:
      return { ...state, GetAllInquiry: action.payload };
    case DELETE_INQUIRY:
      return { ...state, DeleteInquiry: action.payload };
    default:
      return state;
  }
};
