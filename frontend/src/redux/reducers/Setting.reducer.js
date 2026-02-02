import { CREATE_SETTING, createSetting, DELETE_SETTING, GET_ALL_SETTING, UPDATE_SETTING } from "../actions/Setting.action";

const initialState = {
  createSetting: "",
  updateSetting: "",
  getAllSetting: "",
  deleteSetting: "",
};

export const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SETTING:
      return { ...state, createSetting: action.payload};
    case UPDATE_SETTING:
      return { ...state, updateSetting: action.payload};
    case GET_ALL_SETTING:
      return { ...state, getAllSetting: action.payload};
    case DELETE_SETTING:
      return { ...state, deleteSetting: action.payload};
    default:
      return state;
  }
};
