const path = require("path");
const studentApplicationReportsServices = require("../../services/reports/studentApplicationReports");

const getUniqueInterestedInstitutes = async (req, res) => {
    try {
        const result = await studentApplicationReportsServices.getUniqueInterestedInstitutes();

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

const getIntakeMonthAndYearLists = async (req, res) => {
    try {
        const result = await studentApplicationReportsServices.getUniqueIntakeMonthsAndYears();

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

const getStudentApplicationReports = async (req, res) => {
    try {
        const { page, limit, search = "", mainStatus = "", branchId, showAll, institute, intakeMonth, intakeYear, applicationType, startDate,
            endDate, country, type, b2bId, filterUserId } = req.query;
        const currentUser = req.user;
        const result = await studentApplicationReportsServices.getStudentApplicationReports(
            page,
            limit,
            search,
            currentUser,
            mainStatus,
            branchId,
            showAll,
            institute,
            intakeMonth,
            intakeYear,
            applicationType,
            startDate,
            endDate,
            country,
            type,
            b2bId,
            filterUserId
        );

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

const tailormadeAgreementPendingReports = async (req, res) => {
    try {
        const { page, limit, search , status} = req.query;
        const result = await studentApplicationReportsServices.tailormadeAgreementPendingReports(page, limit, search, status , req.user);
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

const getMostPreferredCourses = async (req, res) => {
    try {
        const { page, limit, search = "", institute, country, course } = req.query;
        const result = await studentApplicationReportsServices.getMostPreferredCourses(page, limit, search, institute, country, course , req.user);
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

const exportsDataToExcel = async (req, res) => {
    try {
        const ids = req.query.ids?.split(",") || [];

        const result = await studentApplicationReportsServices.exportDataToExcel(ids);

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message
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
        console.log("error", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const exportMostPreferredCourses = async (req, res) => {
    try {
        const {search, institute, country, course} = req.query
        const result = await studentApplicationReportsServices.exportMostPreferredCourses(search, institute, country, course);

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message
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
        console.log("error", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}


const exportTailormadeAgreementPendingReports = async (req, res) => {
    try {
        const {search, status } = req.query;
        const result = await studentApplicationReportsServices.exportTailormadeAgreementPendingReports(search, status);

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message
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
        console.log("error", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const getFiltersForMostPrefferedCourse = async (req, res) => {
    try {
        const result = await studentApplicationReportsServices.getFiltersForMostPrefferedCourse();
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

const getUniquePreferredCountries = async (req , res) => {
    try{
        const result = await studentApplicationReportsServices.getUniquePreferredCountries();
         return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    }catch (error){
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

module.exports = {
    getUniqueInterestedInstitutes,
    getIntakeMonthAndYearLists,
    getStudentApplicationReports,
    tailormadeAgreementPendingReports,
    getMostPreferredCourses,
    exportsDataToExcel,
    exportMostPreferredCourses,
    exportTailormadeAgreementPendingReports,
    getFiltersForMostPrefferedCourse,
    getUniquePreferredCountries
}