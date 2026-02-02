import Axios from "../../../api.js";
import {
  createCoachingRequirementUrl,
  deleteCoachingRequirementUrl,
  getAllCoachingRequirementUrl,
  updateCoachingRequirementUrl,
} from "../../routes/Master/CoachingRequirement.route";

export const CREATE_COACHING_REQUIREMENT = "CREATE_COACHING_REQUIREMENT";
export const UPDATE_COACHING_REQUIREMENT = "UPDATE_COACHING_REQUIREMENT";
export const GETALL_COACHING_REQUIREMENT = "GETALL_COACHING_REQUIREMENT";
export const DELETE_COACHING_REQUIREMENT = "DELETE_COACHING_REQUIREMENT";

const createCoachingRequirementAction = (payload) => ({ type: CREATE_COACHING_REQUIREMENT, payload });
const updateCoachingRequirementAction = (payload) => ({ type: UPDATE_COACHING_REQUIREMENT, payload });
const getAllCoachingRequirementAction = (payload) => ({ type: GETALL_COACHING_REQUIREMENT, payload });
const deleteCoachingRequirementAction = (payload) => ({ type: DELETE_COACHING_REQUIREMENT, payload });

export const createCoachingRequirement = (payload) => {
  return async (dispatch) => {
    try {
      const res = await Axios.post(createCoachingRequirementUrl, payload);
      dispatch(createCoachingRequirementAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in create Coaching Requirement");
      throw error;
    }
  };
};

export const updateCoachingRequirement = (payload, id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.put(`${updateCoachingRequirementUrl}/${id}`, payload);
      dispatch(updateCoachingRequirementAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in update Coaching Requirement");
      throw error;
    }
  };
};

export const getAllCoachingRequirement = (page = 1, limit = 10, search = "") => {
  return async (dispatch) => {
    try {
      const res = await Axios.get(
        `${getAllCoachingRequirementUrl}?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(getAllCoachingRequirementAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in getAll Coaching Requirement");
      throw error;
    }
  };
};

export const deleteCoachingRequirement = (id) => {
  return async (dispatch) => {
    try {
      const res = await Axios.delete(`${deleteCoachingRequirementUrl}/${id}`);
      dispatch(deleteCoachingRequirementAction(res.data));
      return res;
    } catch (error) {
      console.error("Error fetching in delete Coaching Requirement");
      throw error;
    }
  };
};
