const qualificationServices = require("../../services/masters/qualificationMaster");

const createQualification = async (req, res) => {
    try {
        const result = await qualificationServices.createQualification(req.body , req.user?.userId, req.user?.userName);

        return res.status(201).json({
            status: true,
            code: 201,
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

const updateQualification = async (req,res) => {
    try {
        const result = await qualificationServices.updateQualification(req.params.id, req.body,  req.user?.userId, req.user?.userName);

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

const getAllQualification = async (req, res) => {
    try {

        const {page, limit , search = ""} = req.query;
        const result = await qualificationServices.getAllQualification(page, limit, search);

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

const deleteQualification = async (req, res) => {
    try {
        await qualificationServices.deleteQualification(req.params.id);
        return res.status(200).json({
            status: true,
            code: 200
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
    createQualification,
    updateQualification,
    getAllQualification,
    deleteQualification
}