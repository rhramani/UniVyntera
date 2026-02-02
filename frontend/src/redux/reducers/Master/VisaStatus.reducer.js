import {
  CREATE_VISA_STATUS,
  DELETE_VISA_STATUS,
  GET_ALL_VISA_STATUS,
  GET_VISA_STATUS_BY_ID,
  UPDATE_VISA_STATUS,
} from "../../actions/Master/VisaStatus.action";

const initialState = {
  createVisaStatus: "",
  updateVisaStatus: "",
  deleteVisaStatus: "",
  getAllVisaStatus: "",
  getVisaStatusById: "",
};

export const visaStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VISA_STATUS:
      return { ...state, createVisaStatus: action.payload };
    case UPDATE_VISA_STATUS:
      return { ...state, updateVisaStatus: action.payload };
    case GET_VISA_STATUS_BY_ID:
      return { ...state, getVisaStatusById: action.payload };
    case GET_ALL_VISA_STATUS:
      return { ...state, getAllVisaStatus: action.payload };
    case DELETE_VISA_STATUS:
      return { ...state, deleteVisaStatus: action.payload };
    default:
      return state;
  }
};
