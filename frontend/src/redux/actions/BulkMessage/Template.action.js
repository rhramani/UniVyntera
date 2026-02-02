import Axios from "../../../api";
import {
  createTemplateUrl,
  deleteTemplateUrl,
  getAllTemplateUrl,
} from "../../routes/BulkMessage/Template.route";
import { toast } from "react-toastify"

export const CREATE_TEMPLATE = "CREATE_TEMPLATE";
export const GET_TEMPLATES = "GET_TEMPLATES";
export const DELETE_TEMPLATE = "DELETE_TEMPLATE";

const createTemplateAction = (payload) => ({
  type: CREATE_TEMPLATE,
  payload: payload,
});
const getTemplatesAction = (payload) => ({
  type: GET_TEMPLATES,
  payload: payload,
});
const deleteTemplateAction = (payload) => ({
  type: DELETE_TEMPLATE,
  payload: payload,
});

export const createTemplate = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createTemplateUrl, payload);
      dispatch(createTemplateAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
};

export const getTemplates = (category = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getAllTemplateUrl}?category=${category}`);
      dispatch(getTemplatesAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
};

export const deleteTemplate = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteTemplateUrl}/${payload}`);
      dispatch(deleteTemplateAction(res.data));
      return res;
    } catch (error) {
      console.log("Error", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
};
