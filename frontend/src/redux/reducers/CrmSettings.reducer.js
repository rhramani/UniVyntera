import { CREATE_CRM_SETTINGS, DELETE_CRM_SETTINGS, GET_ALL_CRM_SETTINGS, UPDATE_CRM_SETTINGS } from "../actions/CrmSettings.action";

const initialState = {
  getAllCrmSetting: "",
  createCrmSetting: "",
  updateCrmSetting: "",
  deleteCrmSetting: "",
};

export const CrmSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CRM_SETTINGS:
      return { ...state, getAllCrmSetting: action.payload };
    case CREATE_CRM_SETTINGS:
      return { ...state, createCrmSetting: action.payload };
    case UPDATE_CRM_SETTINGS:
      return { ...state, updateCrmSetting: action.payload };
    case DELETE_CRM_SETTINGS:
      return { ...state, deleteCrmSetting: action.payload };
    default:
      return state;
  }
};
