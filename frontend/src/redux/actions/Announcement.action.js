import Axios from "../../api";
import { announcementsAddUrl, announcementsDeleteUrl, announcementsGetUrl, announcementsUploadUrl } from "../routes/Announcement.routes";

export const ADD_ANNOUNCEMENT = "ADD_ANNOUNCEMENT";
export const UPLOAD_ANNOUNCEMENT = "UPLOAD_ANNOUNCEMENT";
export const GET_ANNOUNCEMENT = "GET_ANNOUNCEMENT";
export const DELETE_ANNOUNCEMENT = "DELETE_ANNOUNCEMENT";

const addAnnouncementsAction = (payload) => ({
  type: ADD_ANNOUNCEMENT,
  payload,
});
const uploadAnnouncementsAction = (payload) => ({
  type: UPLOAD_ANNOUNCEMENT,
  payload,
})
const getAnnouncementsAction = (payload) => ({
  type: GET_ANNOUNCEMENT,
  payload,
});
const deleteAnnouncementsAction = (payload) => ({
  type: DELETE_ANNOUNCEMENT,
  payload,
});

export const addAnnouncement = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(announcementsAddUrl, payload);
      dispatch(addAnnouncementsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const uploadAnnouncement = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(announcementsUploadUrl, payload);
      dispatch(uploadAnnouncementsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const getAnnouncement = (page = 1, limit = 10, search = "", role = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${announcementsGetUrl}?page=${page}&limit=${limit}&search=${search}&role=${role}`);
      dispatch(getAnnouncementsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
};

export const deleteAnnouncement = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${announcementsDeleteUrl}/${id}`);
      dispatch(deleteAnnouncementsAction(res.data));
      return res;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };
}