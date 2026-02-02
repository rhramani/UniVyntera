const documentTypeServices = require("../../../../services/masters/documentList/visitor/visitorDocumentType");

const createDocumentType = async (req, res) => {
    try {
        const result = await documentTypeServices.create(req.body, req.user?.userId, req.user?.userName);

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

const updateDocumentType = async (req, res) => {
    try {
        const result = await documentTypeServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);

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

const getAllDocumentType = async (req,res) => {
    try {
        const {page , limit , search = ""} = req.query;
        const result = await documentTypeServices.getAll(page, limit, search);

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

const deleteDocumentType = async (req,res) =>{
    try {
        const result = await documentTypeServices.delete(req.params.id);
        
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
    createDocumentType,
    updateDocumentType,
    getAllDocumentType,
    deleteDocumentType
}