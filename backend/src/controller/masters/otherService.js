const otherServices = require("../../services/masters/otherService");

const createOther = async (req,res) => {
    try {
        const result = await otherServices.createOther(req.body, req.user?.userId, req.user?.userName);

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

const updateOther = async (req,res) => {
    try {
        const result = await otherServices.updateOther(req.params.id, req.body, req.user?.userId, req.user?.userName);
        
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



const getAllOther = async (req,res) => {
    try {
        const {page , limit , search = ""} = req.query;
        const result = await otherServices.getAllOther(page, limit, search);

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



const deleteOther = async (req,res) => {
    try {
        const result = await otherServices.deleteOther(req.params.id);
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
    createOther,
    updateOther,
    getAllOther,
    deleteOther
}