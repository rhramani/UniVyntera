import Axios from "../../../api";
import {
  createVisitorApplicationUrl,
  deleteVisitorApplicationUrl,
  downloadVisitorDocumentUrl,
  getAllVisitorApplicationUrl,
  getCountryWiseVisitorDocumentUrl,
  getOneVisitorApplicationUrl,
  pendingVisitorDocListUrl,
  pendingVisitorDocMailUrl,
  updateVisitorApplicationUrl,
  visitorApplicationCloneUrl,
} from "../../routes/Visitor/VisitorApplication.route";

export const CREATE_VISITOR_APPLICATION = "CREATE_VISITOR_APPLICATION";
export const UPDATE_VISITOR_APPLICATION = "UPDATE_VISITOR_APPLICATION";
export const GET_ALL_VISITOR_APPLICATION = "GET_ALL_VISITOR_APPLICATION";
export const GET_ONE_VISITOR_APPLICATION = "GET_ONE_VISITOR_APPLICATION";
export const DELETE_VISITOR_APPLICATION = "DELETE_VISITOR_APPLICATION";
export const GET_COUNTRY_WISE_VISITOR_DOCUMENT =
  "GET_COUNTRY_WISE_VISITOR_DOCUMENT";
export const DOWNLOAD_VISITOR_DOCUMENT = "DOWNLOAD_VISITOR_DOCUMENT";
export const VISITOR_APPLICATION_CLONE = "VISITOR_APPLICATION_CLONE";
export const PENDING_VISITOR_DOC_LIST = "PENDING_VISITOR_DOC_LIST";
export const PENDING_VISITOR_DOC_MAIL = "PENDING_VISITOR_DOC_MAIL";

const createVisitorApplicationAction = (payload) => ({
  type: CREATE_VISITOR_APPLICATION,
  payload,
});

const updateVisitorApplicationAction = (payload) => ({
  type: UPDATE_VISITOR_APPLICATION,
  payload,
});

const getAllVisitorApplicationAction = (payload) => ({
  type: GET_ALL_VISITOR_APPLICATION,
  payload,
});

const getOneVisitorApplicationAction = (payload) => ({
  type: GET_ONE_VISITOR_APPLICATION,
  payload,
});

const deleteVisitorApplicationAction = (payload) => ({
  type: DELETE_VISITOR_APPLICATION,
  payload,
});

const getCountryWiseVisitorDocumentAction = (payload) => ({
  type: GET_COUNTRY_WISE_VISITOR_DOCUMENT,
  payload,
});

const downloadVisitorDocumentAction = (payload) => ({
  type: DOWNLOAD_VISITOR_DOCUMENT,
  payload,
});

const visitorApplicationCloneAction = (payload) => ({
  type: VISITOR_APPLICATION_CLONE,
  payload,
});

const pendingVisitorDocListAction = (payload) => ({
  type: PENDING_VISITOR_DOC_LIST,
  payload,
});

const pendingVisitorDocMailAction = (payload) => ({
  type: PENDING_VISITOR_DOC_MAIL,
  payload,
});

export const createVisitorApplication = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createVisitorApplicationUrl}`, payload);
      dispatch(createVisitorApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create Visitor Application:", error);
      throw error;
    }
  };
};

export const updateVisitorApplication = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(
        `${updateVisitorApplicationUrl}/${id}`,
        payload
      );
      dispatch(updateVisitorApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update Visitor Application:", error);
      throw error;
    }
  };
};

export const getAllVisitorApplication = (
  page = 1,
  limit = 10,
  search = "",
  mainStatus = "",
  branchId = "",
  showAll,
  country,
  followUp = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllVisitorApplicationUrl}?page=${page}&limit=${limit}&search=${search}&mainStatus=${mainStatus}&branchId=${branchId}&showAll=${showAll}&country=${country}&followUp=${followUp}`
      );
      dispatch(getAllVisitorApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all Visitor Application:", error);
      throw error;
    }
  };
};

export const getOneVisitorApplication = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneVisitorApplicationUrl}/${id}`);
      dispatch(getOneVisitorApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get one Visitor Application:", error);
      throw error;
    }
  };
};

export const deleteVisitorApplication = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteVisitorApplicationUrl}/${id}`, {
              data: payload, 
            });
      dispatch(deleteVisitorApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete Visitor Application:", error);
      throw error;
    }
  };
};

export const getCountryWiseVisitorDocuments = (country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getCountryWiseVisitorDocumentUrl}?country=${country}`
      );
      dispatch(getCountryWiseVisitorDocumentAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in country wise document:", error);
      throw error;
    }
  };
};

export const downloadVisitorDocument = (visitorId, documentIds) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${downloadVisitorDocumentUrl}/${visitorId}/${documentIds}`,
        {
          responseType: "blob",
        }
      );
      dispatch(downloadVisitorDocumentAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in download document:", error);
      throw error;
    }
  };
};

export const visitorApplicationClone = (id, instituteId, country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(
        `${visitorApplicationCloneUrl}/${id}?instituteId=${instituteId}&country=${country}`
      );
      dispatch(visitorApplicationCloneAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in visitor application clone:", error);
      throw error;
    }
  };
};

export const pendingVisitorDocList = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${pendingVisitorDocListUrl}/${id}`);
      dispatch(pendingVisitorDocListAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in pending doc list:", error);
      throw error;
    }
  };
};

export const pendingVisitorDocMail = (id, selectedDocumentNames) => {
  return async (dispatch) => {
    try {
      const documentList = selectedDocumentNames?.map((name) => ({
        documentName: name,
      }));
      const res = await Axios.post(`${pendingVisitorDocMailUrl}/${id}`, {
        customDocumentList: documentList,
      });
      dispatch(pendingVisitorDocMailAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in pending doc list:", error);
      throw error;
    }
  };
};
