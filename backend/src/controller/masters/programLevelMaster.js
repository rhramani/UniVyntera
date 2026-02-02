const programLevelServices = require("../../services/masters/programLevelMaster");

const createProgramLevelServices = async (req, res) => {
    try {

        const result = await programLevelServices.createProgramLevel(req.body , req.user?.userId, req.user?.userName);
        
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

const updateProgramLevel = async (req,res) => {
    try {
        const result = await programLevelServices.updateProgramLevel(req.params.id, req.body, req.user?.userId, req.user?.userName);

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

const getAllProgramLevels = async (req,res) => {
    try {
        const {page, limit , search = ""} = req.query;
        const result = await programLevelServices.getAll(page, limit , search);

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

const deleteProgramById = async (req, res) => {
    try {
        const result = await programLevelServices.deleteProgramLevelById(req.params.id);

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

module.exports = { createProgramLevelServices, updateProgramLevel, getAllProgramLevels, deleteProgramById };