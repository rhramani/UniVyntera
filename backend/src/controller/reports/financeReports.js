const financeReportServices = require("../../services/reports/financeReports");
const path = require("path");

const feePaymentReports = async (req, res) => {
    try {
        const { page, limit, search, feeStatus, startDate, endDate } = req.query;
        const result = await financeReportServices.feePaymentReports(page, limit, search, feeStatus, startDate, endDate , req.user);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const studentFinanceSummary = async (req, res) => {
    try {
        const { page, limit, search, type, startDate, endDate } = req.query;
        const result = await financeReportServices.studentFinanceSummary(page, limit, search, type, startDate, endDate);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const universityPaymentCollection = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await financeReportServices.universityPaymentCollection(page, limit, search);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const exportFeePaymentReports = async (req, res) => {
    try {
        const { search, feeStatus } = req.query;
        const result = await financeReportServices.exportFeePaymentReports(search, feeStatus);

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message,
            })
        }
        const fileName = path.basename(result.filePath);
        const fileUrl = `/public/${fileName}`;

        return res.status(200).json({
            status: true,
            code: 200,
            fileUrl
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const exportStudentFinanceSummaryReport = async (req, res) => {
    try {
        const { search, type } = req.query;
        const result = await financeReportServices.exportStudentFinanceSummaryReport(search, type);

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message,
            })
        }
        const fileName = path.basename(result.filePath);
        const fileUrl = `/public/${fileName}`;

        return res.status(200).json({
            status: true,
            code: 200,
            fileUrl
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const universityPaymentCollectionExport = async (req, res) => {
    try {
        const result = await financeReportServices.universityPaymentCollectionExport();

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message,
            })
        }
        const fileName = path.basename(result.filePath);
        const fileUrl = `/public/${fileName}`;

        return res.status(200).json({
            status: true,
            code: 200,
            fileUrl
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

module.exports = {
    feePaymentReports,
    studentFinanceSummary,
    universityPaymentCollection,
    exportFeePaymentReports,
    exportStudentFinanceSummaryReport,
    universityPaymentCollectionExport
}