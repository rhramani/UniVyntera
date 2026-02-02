const examServices = require("../../../services/masters/lead/exam");

const createExam = async (req,res) => {
    try {
        const result = await examServices.createExam(req.body, req.user?.userId, req.user?.userName);

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

const updateExam = async (req,res) => {
    try {
        const result = await examServices.updateExam(req.params.id, req.body, req.user?.userId, req.user?.userName);
        
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



const getAllExam = async (req,res) => {
    try {
        const {page , limit , search = ""} = req.query;
        const result = await examServices.getAllExam(page, limit, search);

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




const deleteExam = async (req,res) => {
    try {
        const result = await examServices.deleteExam(req.params.id);
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
    createExam,
    updateExam,
    getAllExam,
    deleteExam
}