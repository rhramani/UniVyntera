import Axios from "../../../api.js";
import {
  createAndUpdateAttendanceUrl,
  createStudentApplicationUrl,
  deleteAttendanceUrl,
  deleteStudentApplicationUrl,
  downloadDocumentUrl,
  getAccountantUrl,
  getAllAttendanceUrl,
  getAllStudentApplicationUrl,
  getCoachingStudentUrl,
  getCountryWiseDocumentUrl,
  getFollowupStudentUrl,
  getOneStudentApplicationUrl,
  pendingDocListUrl,
  pendingDocMailUrl,
  studentInstituteCloneUrl,
  updateStudentApplicationUrl,
  accountantStudentApplicationUrl,
  getAllPastStudentAttendanceUrl,
  downloadStudentApplicationUrl,
  sendFeesDeadlineEmailUrl,
} from "../../routes/Student/StudentApplication.route";

export const CREATE_STUDENT_APPLICATION = "CREATE_STUDENT_APPLICATION";
export const UPDATE_STUDENT_APPLICATION = "UPDATE_STUDENT_APPLICATION";
export const GET_ALL_STUDENT_APPLICATION = "GET_ALL_STUDENT_APPLICATION";
export const GET_ONE_STUDENT_APPLICATION = "GET_ONE_STUDENT_APPLICATION";
export const DELETE_STUDENT_APPLICATION = "DELETE_STUDENT_APPLICATION";
export const STUDENT_ACCOUNTANT = "STUDENT_ACCOUNTANT";
export const GET_COUNTRY_WISE_DOCUMENT = "GET_COUNTRY_WISE_DOCUMENT";
export const DOWNLOAD_DOCUMENT = "DOWNLOAD_DOCUMENT";
export const STUDENT_APPLICATION_CLONE = "STUDENT_APPLICATION_CLONE";
export const PENDING_DOC_LIST = "PENDING_DOC_LIST";
export const PENDING_DOC_MAIL = "PENDING_DOC_MAIL";
export const GET_COACHING_STUDENT = "GET_COACHING_STUDENT";
export const GET_FOLLOWUP_STUDENT = "GET_FOLLOWUP_STUDENT";
export const DOWNLOAD_STUDENT_APPLICATION = "DOWNLOAD_STUDENT_APPLICATION";
export const SEND_FEES_DEADLINE_EMAIL = "SEND_FEES_DEADLINE_EMAIL";

// attendance
export const CREATE_AND_UPDATE_ATTENDANCE = "CREATE_AND_UPDATE_ATTENDANCE";
export const GET_ALL_ATTENDANCE = "GET_ALL_ATTENDANCE";
export const DELETE_ATTENDANCE = "DELETE_ATTENDANCE";
export const GET_ALL_PAST_STUDENT_ATTENDANCE =
  "GET_ALL_PAST_STUDENT_ATTENDANCE";

export const GET_ACCOUNTANT = "GET_ACCOUNTANT";

const createStudentApplicationAction = (payload) => ({
  type: CREATE_STUDENT_APPLICATION,
  payload,
});
const updateStudentApplicationAction = (payload) => ({
  type: UPDATE_STUDENT_APPLICATION,
  payload,
});
const getAllStudentApplicationAction = (payload) => ({
  type: GET_ALL_STUDENT_APPLICATION,
  payload,
});
const getOneStudentApplicationAction = (payload) => ({
  type: GET_ONE_STUDENT_APPLICATION,
  payload,
});
const deleteStudentApplicationAction = (payload) => ({
  type: DELETE_STUDENT_APPLICATION,
  payload,
});

const studentAccountantAction = (payload) => ({
  type: STUDENT_ACCOUNTANT,
  payload,
});

const getCountryWiseDocumentAction = (payload) => ({
  type: GET_COUNTRY_WISE_DOCUMENT,
  payload,
});
const downloadDocumentAction = (payload) => ({
  type: DOWNLOAD_DOCUMENT,
  payload,
});

const studentApplicationCloneAction = (payload) => ({
  type: STUDENT_APPLICATION_CLONE,
  payload,
});

const pendingDocListAction = (payload) => ({
  type: PENDING_DOC_LIST,
  payload,
});

const pendingDocMailAction = (payload) => ({
  type: PENDING_DOC_MAIL,
  payload,
});

const getCoachingStudentAction = (payload) => ({
  type: GET_COACHING_STUDENT,
  payload,
});

const getFollowupStudentAction = (payload) => ({
  type: GET_FOLLOWUP_STUDENT,
  payload,
});

const downloadStudentApplicationAction = (payload) => ({
  type: DOWNLOAD_STUDENT_APPLICATION,
  payload,
});

const sendFeesDeadlineEmailAction = (payload) => ({
  type: SEND_FEES_DEADLINE_EMAIL,
  payload,
});

// attendance

const createAndUpdateAttendanceAction = (payload) => ({
  type: CREATE_AND_UPDATE_ATTENDANCE,
  payload,
});

const getAllAttendenceAction = (payload) => ({
  type: GET_ALL_ATTENDANCE,
  payload,
});

const deleteAttendanceAction = (payload) => ({
  type: DELETE_ATTENDANCE,
  payload,
});

const getAccountantAction = (payload) => ({
  type: GET_ACCOUNTANT,
  payload,
});

const getAllPastStudentAttendanceAction = (payload) => ({
  type: GET_ALL_PAST_STUDENT_ATTENDANCE,
  payload,
});

export const createStudentApplication = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createStudentApplicationUrl, payload);
      dispatch(createStudentApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create Inquiry:", error);
      throw error;
    }
  };
};

export const updateStudentApplication = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(
        `${updateStudentApplicationUrl}/${id}`,
        payload
      );
      dispatch(updateStudentApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update Inquiry:", error);
      throw error;
    }
  };
};

export const getAllStudentApplication = (
  page = 1,
  limit = 10,
  searchOnField = "",
  search = "",
  mainStatus = "",
  branchId = "",
  showAll,
  country,
  followUp = "",
  b2bId = "",
  updatedOn = "",
  role = "",
  user = "",
  startDate = "",
  endDate = ""
) => {
  return async (dispatch) => {
    try {
      let url = `${getAllStudentApplicationUrl}?page=${page}&limit=${limit}&searchOnField=${searchOnField}&search=${search}&mainStatus=${mainStatus}&branchId=${branchId}&showAll=${showAll}&country=${country}&followUp=${followUp}&b2bId=${b2bId}&updatedOn=${updatedOn}&startDate=${startDate}&endDate=${endDate}`;
      
      // Add role and user parameters if provided
      // if (role) {
      //   url += `&role=${role}`;
      // }
      if (user) {
        // If user is an array, join with comma
        const userParam = Array.isArray(user) ? user.join(",") : user;
        url += `&filterUserId=${userParam}`;
      }
      
      const res = await Axios.get(url);
      dispatch(getAllStudentApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all Inquiry:", error);
      throw error;
    }
  };
};

export const getOneStudentApplication = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneStudentApplicationUrl}/${id}`);
      dispatch(getOneStudentApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all Inquiry:", error);
      throw error;
    }
  };
};

export const deleteStudentApplication = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteStudentApplicationUrl}/${id}`, {
        data: payload,
      });
      dispatch(deleteStudentApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete Inquiry:", error);
      throw error;
    }
  };
};

export const studentAccountant = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${accountantStudentApplicationUrl}/${id}`);
      dispatch(studentAccountantAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in student accountant:", error);
      throw error;
    }
  };
};

export const getCountryWiseDocuments = (country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getCountryWiseDocumentUrl}?country=${country}`
      );
      dispatch(getCountryWiseDocumentAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in country wise document:", error);
      throw error;
    }
  };
};

export const downloadDocument = (applicationId, documentIds) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${downloadDocumentUrl}/${applicationId}/${documentIds}`,
        {
          responseType: "blob",
        }
      );
      dispatch(downloadDocumentAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in download document:", error);
      throw error;
    }
  };
};

export const studentApplicationClone = (id, country, payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(
        `${studentInstituteCloneUrl}/${id}?country=${country}`,
        payload
      );
      dispatch(studentApplicationCloneAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in student application clone:", error);
      throw error;
    }
  };
};

export const pendingDocList = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${pendingDocListUrl}/${id}`);
      dispatch(pendingDocListAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in pending doc list:", error);
      throw error;
    }
  };
};

export const pendingDocMail = (id, selectedDocumentNames) => {
  return async (dispatch) => {
    try {
      const documentList = selectedDocumentNames.map((name) => ({
        documentName: name,
      }));

      const res = await Axios.post(`${pendingDocMailUrl}/${id}`, {
        customDocumentList: documentList,
      });
      dispatch(pendingDocMailAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in pending doc list:", error);
      throw error;
    }
  };
};

export const getCoachingStudent = (
  page = 1,
  limit = 10,
  search = "",
  status,
  faculty,
  startDate,
  endDate,
  targetAchieved,
  branch,
  showAll
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getCoachingStudentUrl}?page=${page}&limit=${limit}&search=${search}&status=${status}&faculty=${faculty}&startDate=${startDate}&endDate=${endDate}&targetAchieved=${targetAchieved}&branch=${branch}&showAll=${showAll}`
      );
      dispatch(getCoachingStudentAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get coaching student:", error);
      throw error;
    }
  };
};

export const getFollowupStudent = (
  page = 1,
  limit = 10,
  search = "",
  date,
  country,
  type
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getFollowupStudentUrl}?page=${page}&limit=${limit}&search=${search}&date=${date}&country=${country}&type=${type}`
      );
      dispatch(getFollowupStudentAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get followup student:", error);
      throw error;
    }
  };
};

export const downloadStudentApplication = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${downloadStudentApplicationUrl}`, {
        params: payload,
      });
      dispatch(downloadStudentApplicationAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in download student application:", error);
      throw error;
    }
  };
};

export const sendFeesDeadlineEmail = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${sendFeesDeadlineEmailUrl}/${id}`);
      dispatch(sendFeesDeadlineEmailAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in send fees deadline email:", error);
      throw error;
    }
  }
}

export const createAndUpdateAttendance = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createAndUpdateAttendanceUrl}`, payload);
      dispatch(createAndUpdateAttendanceAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create and update attendance:", error);
      throw error;
    }
  };
};

export const getAllAttendence = (
  startDate,
  endDate,
  studentId,
  page = 1,
  limit = 10
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllAttendanceUrl}?startDate=${startDate}&endDate=${endDate}&studentId=${studentId}&page=${page}&limit=${limit}`
      );
      dispatch(getAllAttendenceAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get all attendence:", error);
      throw error;
    }
  };
};

export const deleteAttendance = (studentId, date) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(
        `${deleteAttendanceUrl}/${studentId}/${date}`
      );
      dispatch(deleteAttendanceAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete attendance:", error);
      throw error;
    }
  };
};

export const getAccountant = (
  id,
  mainPlan,
  page = 1,
  limit = 10,
  search = ""
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAccountantUrl}?id=${id}&mainPlan=${mainPlan}&page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAccountantAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get Accountant:", error);
      throw error;
    }
  };
};

export const getAllPastStudentAttendance = (
  startDate,
  endDate,
  studentId,
  page = 1,
  limit = 10
) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllPastStudentAttendanceUrl}?startDate=${startDate}&endDate=${endDate}&studentId=${studentId}&page=${page}&limit=${limit}`
      );
      dispatch(getAllPastStudentAttendanceAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in get Accountant clone:", error);
      throw error;
    }
  };
};
