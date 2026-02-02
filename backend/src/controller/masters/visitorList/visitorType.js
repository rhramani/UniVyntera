const visitorTypeServices = require("../../../services/masters/visitorList/visitorType");

const createVisitorType = async (req, res) => {
    try {
        const result = await visitorTypeServices.create(req.body, req.user?.userId, req.user?.userName);

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

const updateVisitorType = async (req, res) => {
    try {
        const result = await visitorTypeServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);

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

const getAllVisitorType = async (req,res) => {
    try {
        const {page , limit , search = ""} = req.query;
        const result = await visitorTypeServices.getAll(page, limit, search);

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

const deleteVisitorType = async (req,res) =>{
    try {
        const result = await visitorTypeServices.delete(req.params.id);
        
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

module.exports = {
    createVisitorType,
    updateVisitorType,
    getAllVisitorType,
    deleteVisitorType
}