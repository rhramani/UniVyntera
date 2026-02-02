import { BASEURL } from "../../../baseUrl";

export const createStudentApplicationUrl = `${BASEURL}/studentApplication/create`
export const updateStudentApplicationUrl = `${BASEURL}/studentApplication/update`
export const getAllStudentApplicationUrl = `${BASEURL}/studentApplication/getAll`
export const getOneStudentApplicationUrl = `${BASEURL}/studentApplication/getOne`
export const deleteStudentApplicationUrl = `${BASEURL}/studentApplication/delete`
export const accountantStudentApplicationUrl = `${BASEURL}/studentApplication/studentAccountant`
export const getCountryWiseDocumentUrl = `${BASEURL}/countryDocuments/getAll`
export const downloadDocumentUrl = `${BASEURL}/studentApplication/download`
export const studentInstituteCloneUrl = `${BASEURL}/studentApplication/clone`
export const pendingDocListUrl = `${BASEURL}/studentApplication/pendingDocList`
export const pendingDocMailUrl = `${BASEURL}/studentApplication/pendingDocMail`
export const getCoachingStudentUrl = `${BASEURL}/studentApplication/getCoachingStudent`
export const getFollowupStudentUrl = `${BASEURL}/studentApplication/getFollowupStudent`
export const downloadStudentApplicationUrl = `${BASEURL}/studentApplication/downloadStudentExcel`
export const sendFeesDeadlineEmailUrl = `${BASEURL}/studentApplication/sendFeesDeadlineEmail`

// attendance
export const createAndUpdateAttendanceUrl = `${BASEURL}/attendence/mark`
export const getAllAttendanceUrl = `${BASEURL}/attendence/getAll`
export const deleteAttendanceUrl = `${BASEURL}/attendence/delete`
export const getAllPastStudentAttendanceUrl = `${BASEURL}/attendence/getPastStudent`


export const getAccountantUrl = `${BASEURL}/generateInvoice/getInvoiceWithTotals`