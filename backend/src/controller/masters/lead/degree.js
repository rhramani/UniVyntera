const degreeServices = require("../../../services/masters/lead/degree");

const createDegree = async (req,res) => {
    try {
        const result = await degreeServices.createDegree(req.body, req.user?.userId, req.user?.userName);

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

const updateDegree = async (req,res) => {
    try {
        const result = await degreeServices.updateDegree(req.params.id, req.body, req.user?.userId, req.user?.userName);
        
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



const getAllDegree = async (req,res) => {
    try {
        const {page , limit , search = ""} = req.query;
        const result = await degreeServices.getAllDegree(page, limit, search);

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


const deleteDegree = async (req,res) => {
    try {
        const result = await degreeServices.deleteDegree(req.params.id);
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
    createDegree,
    updateDegree,
    getAllDegree,
    deleteDegree
}