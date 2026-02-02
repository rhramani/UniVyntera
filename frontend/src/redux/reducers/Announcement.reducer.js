import { ADD_ANNOUNCEMENT } from "../actions/Announcement.action";

const initialState = {
    addAnnouncement: "",
};

export const AnnouncementReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ANNOUNCEMENT:
            return { ...state, addAnnouncement: action.payload };
        default:
            return state;
    }
}