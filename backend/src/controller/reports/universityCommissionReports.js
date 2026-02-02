const universityCommissionReportsServices = require("../../services/reports/universityCommissionReports");

const universityCommission = async (req, res) => {
    try {
        const { page, limit, search, type, status, startDate,
            endDate, b2bId, branchId, reportType, intakeMonth,
            intakeYear,showAll } = req.query;
        const result = await universityCommissionReportsServices.universityCommission(page, limit, search, type, status, startDate,
            endDate, b2bId, branchId, reportType, intakeMonth,
            intakeYear, showAll);
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        console.log("erroroorr" , error);
        res.status(500).json({
            status: true,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}



module.exports = {
    universityCommission,
}