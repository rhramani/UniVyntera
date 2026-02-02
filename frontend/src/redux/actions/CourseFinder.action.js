import Axios from "../../api.js";
import {
  bulkUploadUrl,
  countryDropDownUrl,
  courseDownloadExcelUrl,
  createCourseFinderUrl,
  currencyCodeUrl,
  deleteCourseFinderUrl,
  durationDropDownUrl,
  getAllCourseFinderUrl,
  getDisciplineAreasUrl,
  getOneCourseFinderUrl,
  getStudyAreaUrl,
  updateCourseFinderUrl,
} from "../routes/CourseFinder.route";

export const CREATE_COURSE_FINDER = "CREATE_COURSE_FINDER";
export const UPDATE_COURSE_FINDER = "UPDATE_COURSE_FINDER";
export const GET_ALL_COURSE_FINDER = "GET_ALL_COURSE_FINDER";
export const GET_ONE_COURSE_FINDER = "GET_ONE_COURSE_FINDER";
export const DELETE_COURSE_FINDER = "DELETE_COURSE_FINDER";
export const COURSE_DOWNLOAD_EXCEL = "COURSE_DOWNLOAD_EXCEL";
export const BULK_UPLOAD = "BULK_UPLOAD";
export const CURRENCY_CODE = "CURRENCY_CODE";
export const COUNTRY_DROPDOWN = "COUNTRY_DROPDOWN";
export const DURATION_DROPDOWN = "DURATION_DROPDOWN";
export const GET_DEPENDENT_FILTER = "GET_DEPENDENT_FILTER";
export const GET_STUDY_AREA = "GET_STUDY_AREA";

const createCourseFinderAction = (payload) => ({
  type: CREATE_COURSE_FINDER,
  payload,
});
const updateCourseFinderAction = (payload) => ({
  type: UPDATE_COURSE_FINDER,
  payload,
});
const getAllCourseFinderAction = (payload) => ({
  type: GET_ALL_COURSE_FINDER,
  payload,
});
const getOneCourseFinderAction = (payload) => ({
  type: GET_ONE_COURSE_FINDER,
  payload,
});
const deleteCourseFinderAction = (payload) => ({
  type: DELETE_COURSE_FINDER,
  payload,
});
const courseDownloadExcelAction = (payload) => ({
  type: COURSE_DOWNLOAD_EXCEL,
  payload,
});
const bulkUploadAction = (payload) => ({ type: BULK_UPLOAD, payload });
const currencyCodeAction = (payload) => ({ type: CURRENCY_CODE, payload });
const countryDropDownAction = (payload) => ({
  type: COUNTRY_DROPDOWN,
  payload,
});
const durationDropDownAction = (payload) => ({
  type: DURATION_DROPDOWN,
  payload,
});
const getDependentFilterAction = (payload) => ({
  type: GET_DEPENDENT_FILTER,
  payload,
});
const getStudyAreaAction = (payload) => ({ type: GET_STUDY_AREA, payload });

export const createCourseFinder = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${createCourseFinderUrl}`, payload);
      dispatch(createCourseFinderAction(res));
      return res;
    } catch (error) {
      console.log("Error fetching in create course", error);
      throw error;
    }
  };
};

export const updateCourseFinder = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCourseFinderUrl}/${id}`, payload);
      dispatch(updateCourseFinderAction(res));
      return res;
    } catch (error) {
      console.log("Error fetching in update course", error);
      throw error;
    }
  };
};

// export const getAllCourseFinder = (page = 1, limit = 10, search = "") => {
//   return async (dispatch) => {
//     try {
//       const res = await Axios.get(`${getAllCourseFinderUrl}?page=${page}&limit=${limit}&search=${search}`);
//       dispatch(getAllCourseFinderAction(res));
//       return res;
//     } catch (error) {
//       console.log("Error", error);
//       throw error;
//     }
//   };
// };

export const getAllCourseFinder = (page = 1, limit = 12, filters = {}) => {
  return async (dispatch) => {
    try {
      // Construct query params string
      const queryParams = new URLSearchParams({
        page,
        limit,
        // search,
        ...filters, // Spread the filter object into query params
      }).toString();

      // Call the API with the constructed query string
      const res = await Axios.get(`${getAllCourseFinderUrl}?${queryParams}`);

      dispatch(getAllCourseFinderAction(res));
      return res;
    } catch (error) {
      console.log("Error fetching in get all course", error);
      throw error;
    }
  };
};

export const getOneCourseFinder = (courseId) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getOneCourseFinderUrl}/${courseId}`);
      dispatch(getOneCourseFinderAction(res));
      return res;
    } catch (error) {
      console.log("Error fetching in get one course", error);
      throw error;
    }
  };
};

export const deleteCourseFinder = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCourseFinderUrl}/${id}`);
      dispatch(deleteCourseFinderAction(res));
      return res;
    } catch (error) {
      console.log("Error fetching in delete course", error);
      throw error;
    }
  };
};

export const courseDownloadExcel = (ids) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${courseDownloadExcelUrl}/?ids=${ids}`);
      dispatch(courseDownloadExcelAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const bulkUpload = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(`${bulkUploadUrl}`, payload);
      dispatch(bulkUploadAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
export const currencyCode = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${currencyCodeUrl}`);
      dispatch(currencyCodeAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const countryDropDownCourse = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${countryDropDownUrl}`);
      dispatch(countryDropDownAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const durationDropDown = () => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${durationDropDownUrl}`);
      dispatch(durationDropDownAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getDependentFilter = (country, studyArea) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getDisciplineAreasUrl}?country=${country}&studyArea=${studyArea}`
      );
      dispatch(getDependentFilterAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};

export const getStudyArea = (country) => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`${getStudyAreaUrl}?country=${country}`);
      dispatch(getStudyAreaAction(res));
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  };
};
