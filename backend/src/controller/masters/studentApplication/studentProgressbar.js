const studentProgressbarServices = require("../../../services/masters/studentApplication/studentProgressbar");

const createOrUpdateProgress = async (req,res) => {
    try {
        const result = await studentProgressbarServices.createOrUpdateSteps(req.body, req.user?.userId, req.user?.userName);

        return res.status(201).json({
            status: true,
            code: 201,
            data: result,
        })
        
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const getAllProgressSteps = async (req,res) => {
    try {
        const {page, limit, searchText = "", country = "" } = req.query;
        const result = await studentProgressbarServices.getAll(page, limit, searchText, country);
        return res.status(200).json({
            status: true,
            code: 200,
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const deleteProgressSteps = async (req, res) => {
    try {
        const result = await studentProgressbarServices.delete(req.params.id);

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

module.exports = {
    createOrUpdateProgress,
    getAllProgressSteps,
    deleteProgressSteps 
}