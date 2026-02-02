import { BASEURL } from "../../../baseUrl";

// student application report
export const getAllIntakeUrl = `${BASEURL}/studentReports/getintakes`;
export const getAllInstituteUrl = `${BASEURL}/studentReports/getInstitute`;
export const getAllStudentReportUrl = `${BASEURL}/studentReports/getReport`;
export const uniquePreferredCountriesUrl = `${BASEURL}/studentReports/getUniquePreferredCountries`;
export const getAllPendingAgreementUrl = `${BASEURL}/studentReports/getPendingAgreement`;
export const getAllMostPreferredCourseUrl = `${BASEURL}/studentReports/getMostPreferredCourses`;
export const exportStudentReportDownloadUrl = `${BASEURL}/studentReports/downloadReport`;
export const exportMostPreferredCoursesUrl = `${BASEURL}/studentReports/exportMostPreferredCourses`;
export const exportPendingAgreementDataUrl = `${BASEURL}/studentReports/exportPendingAgreement`;
export const getFiltersForMostPrefferedCourseUrl = `${BASEURL}/studentReports/getFiltersForMostPrefferedCourse`;

// partner commission
export const partenerCommissionReportUrl = `${BASEURL}/partnerCommissionReports/partnerCommissionSummary`;
export const partenerPendingB2BInvoiceUrl = `${BASEURL}/partnerCommissionReports/pendingB2BInvoice`;
export const partnerUniqueB2BAndBranchListUrl = `${BASEURL}/partnerCommissionReports/uniqueB2BAndBranchList `;
export const partnerConversionReportUrl = `${BASEURL}/partnerCommissionReports/partnerConversionReport`;
export const partnerConversionReportExportUrl = `${BASEURL}/partnerCommissionReports/exportPartnerConversion`;
export const totalPendingB2BCountryUrl = `${BASEURL}/partnerCommissionReports/totalPendingB2BCountry`;

// university commission
export const getAllUniversityCommissionReportsUrl = `${BASEURL}/universityCommissionReports/universityCommission`;

// finance reports

export const getFeePaymentReportUrl = `${BASEURL}/feePaymentReports/feePayment`;
export const getStudentFinanceSummaryReportUrl = `${BASEURL}/feePaymentReports/studentFinanceSummary`;
export const getUniversityPaymentCollectionUrl = `${BASEURL}/feePaymentReports/universityPaymentCollection`;
export const exportFeePaymentReportsUrl = `${BASEURL}/feePaymentReports/exportfeePayment`;
export const exportStudentFinanceSummaryReportUrl = `${BASEURL}/feePaymentReports/exportFeePaymentReports`;
export const exportUniversityPaymentCollectionUrl = `${BASEURL}/feePaymentReports/exportUniversityPaymentCollection`;

// visa report
export const getVisaProcessReportUrl = `${BASEURL}/visaReports/getVisa`;
export const exportVisaProcessReportUrl = `${BASEURL}/visaReports/exportVisaReport`;