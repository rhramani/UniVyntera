import { ADD_CAMPAIGN, GET_CAMPAIGN } from "../../actions/BulkMessage/Compaign.action";

const initialState = {
    campaignResult: "",
    getAllCampaign: [],

};

const campaignReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CAMPAIGN:
            return {
                ...state,
                campaignResult: action.payload,
            };
        case GET_CAMPAIGN:
            return {
                ...state,
                getAllCampaign: action.payload?.result?.data || [],
            };
        default:
            return state;
    }
};

export default campaignReducer;
