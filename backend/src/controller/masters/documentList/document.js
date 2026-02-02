const documentServices = require("../../../services/masters/documentList/document");

const createDocument = async (req, res) => {
    try {
        const result = await documentServices.create(req.body, req.user?.userId, req.user?.userName);

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

const updateDocument = async (req, res) => {
    try {
        const result = await documentServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);

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

const getAllDocument = async (req,res) => {
    try {
        const {page , limit , search = "" , type=""} = req.query;
        const result = await documentServices.getAll(page, limit, search, type);

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

const deleteDocument = async (req,res) =>{
    try {
        const result = await documentServices.delete(req.params.id);
        
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
    createDocument,
    updateDocument,
    getAllDocument,
    deleteDocument
}