const path = require("path");
const visaReportServices = require("../../services/reports/visaReports");


const getVisaReports = async (req, res) => {
    try {
        const { page, limit, search, status, startDate, endDate, country } = req.query;
        const result = await visaReportServices.getVisaReports(page, limit, search, status, startDate, endDate, country , req.user);

        res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "Something went wrong"
        })
    }
}

const exportVisaReport = async (req, res) => {
    try {
        const ids = req.query.ids?.split(",") || [];
        const result = await visaReportServices.exportVisaReport(ids);

        if(!result.success){
            return res.status(404).json({
                status: false,
                message: result.message
            });
        }
        const fileName = path.basename(result.filePath);
        const fileUrl = `/public/${fileName}`;

        return res.status(200).json({
            status: true,
            code: 200,
            fileUrl
        })
    } catch (error) {
        console.log("errorr", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: "Something went wrong"
        })
    }
}
module.exports = {
    getVisaReports,
    exportVisaReport
}