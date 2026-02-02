import { BASEURL } from "../../../baseUrl";

export const getAllUniversityCommissionUrl = `${BASEURL}/accountant/universityCommission`;
export const getTotalCommissionUniversityUrl = `${BASEURL}/accountant/totalCommissionUniversity`;
export const getTotalCommissionCountryUrl = `${BASEURL}/accountant/totalCommissionCountry`;
export const getTotalB2BCommissionUrl = `${BASEURL}/accountant/b2bCommissionList`;
export const commissionQueryMailUrl = `${BASEURL}/accountant/commissionQueryMail`;
export const commissionEditInvoiceUrl = `${BASEURL}/accountant/editInvoice`;
export const studentByB2BUrl = `${BASEURL}/accountant/studentByB2B`;

// student invoice
export const studentInvoiceCreateUrl = `${BASEURL}/studentInvoice/create`;
export const studentInvoiceGetAllUrl = `${BASEURL}/studentInvoice/get`;
export const studentInvoiceUpdateUrl = `${BASEURL}/studentInvoice/update`;
export const studentInvoiceDeleteUrl = `${BASEURL}/studentInvoice/delete`;
export const studentInvoiceReportExportUrl = `${BASEURL}/studentInvoice/getReport`;