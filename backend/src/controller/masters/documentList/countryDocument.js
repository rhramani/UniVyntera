const countryDocumentServices = require("../../../services/masters/documentList/countryDocument");

const create = async (req, res) => {
    try {
        const result = await countryDocumentServices.create(req.body, req.user?.userId, req.user?.userName);
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

const update = async (req,res) => {
    try {
        const result = await countryDocumentServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);
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


const getAll = async (req,res) => {
    try {
        const { page, limit , search = "", country= ""} = req.query;
        const result = await countryDocumentServices.getAll(page, limit, search, country);
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

const deleteData = async (req,res) =>{
    try {
        const result = await countryDocumentServices.delete(req.params.id);
        
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
    create,
    update,
    getAll,
    deleteData
}