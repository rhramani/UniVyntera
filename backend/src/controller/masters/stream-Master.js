const streamServices = require("../../services/masters/streamMaster");

const createStream = async (req, res) => {
    try {
        const result = await streamServices.createStream(req.body , req.user.userId);

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

const updateStream = async (req, res) => {
    try {
        const result = await streamServices.updateStream(req.params.id, req.body);

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

const getAllStream = async (req,res) => {
    try {

        const {page , limit , search = ""} = req.query;
        const result = await streamServices.getAllStream(page, limit, search);

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

const deleteStream = async (req, res) => {
    try {
         await streamServices.deleteStream(req.params.id);
         
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
    createStream,
    updateStream,
    getAllStream,
    deleteStream
}