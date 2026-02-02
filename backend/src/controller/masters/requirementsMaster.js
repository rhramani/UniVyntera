const requirementServices = require("../../services/masters/requirementsMaster");

const createRequirements = async (req ,res) => {
    try {
        const result = await requirementServices.createRequirement(req.body , req.user?.userId , req.user?.userName);
        
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

const updateRequirements = async (req, res) => {
    try {
        const result = await requirementServices.updateRequirement(req.params.id , req.body, req.user?.userId , req.user?.userName);
        
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

const getAllRequirements = async (req, res) => {
    try {
        const {page, limit , search = ""} = req.query;
        const result = await requirementServices.getAllRequirements(page, limit , search);

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

const deleteRequirement = async (req, res) => {
    try {

        const result = await requirementServices.deleteRequirementById(req.params.id);

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

module.exports = { createRequirements,
                   updateRequirements,
                   getAllRequirements,
                   deleteRequirement
                }