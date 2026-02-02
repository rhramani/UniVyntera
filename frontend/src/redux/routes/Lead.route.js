import { BASEURL } from "../../baseUrl";

export const leadAddUrl = `${BASEURL}/leads/addLead`;
export const leadListUrl = `${BASEURL}/leads/leadGetAll`;
export const leadByFilter = `${BASEURL}/leads/leadByFilter`;
export const leadById = `${BASEURL}/leads/leadGet`;
export const leadUpdate = `${BASEURL}/leads/leadUpdate`;
export const bulkLeadAssign = `${BASEURL}/leads/bulk-lead-assign`;
export const leadDelete = `${BASEURL}/leads/leadDelete`;
export const downloadData = `${BASEURL}/leads/downloadLead`;
export const bulkLead = `${BASEURL}/leads/upload-excel`;
export const leadBulkDelete = `${BASEURL}/leads/bulk-delete`;
export const counsellorList = `${BASEURL}/users/getCounselors`;
export const followUpLeadByDateUrl = `${BASEURL}/leads/followUpLeadByDate`;
export const followUpLeadsUrl = `${BASEURL}/leads/getFollowUpLeads`;
export const editHistoryUrl = `${BASEURL}/leads/editHistory`;
export const convertToApplicationUrl = `${BASEURL}/leads/convertToApplication`;
export const getLeadByAssignUserIdUrl = `${BASEURL}/leads/leadById`;
export const getLeadByAssignedUserUrl = `${BASEURL}/leads/assignedUser`;
export const sendWPMessageUrl = `${BASEURL}/leads/sendWPMessage`;
export const getLeadFromUrl = `${BASEURL}/leads/leadFroms`;
export const getLeadCountryUrl = `${BASEURL}/leads/countryList`; 
export const getTodaysBirthdayLeadUrl = `${BASEURL}/leads/birthDay`; 
export const getB2BLeadUrl = `${BASEURL}/leads/getB2BLead`;
export const getPendingFollowUpsUrl = `${BASEURL}/leads/getPendingFollowUps`;


// application process
export const getApplicationProcess = `${BASEURL}/leads/applicationProcess`

// ctc calling
export const addCtcCallingUrl = `${BASEURL}/ctcCalling/callLead`;