const templateServices = require("../../services/masters/wptemplate");

const create = async (req,res) => {
    try {
        const result = await templateServices.create(req.body, req.user?.userId, req.user?.userName);

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
        const result = await templateServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);
        
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

const getById = async (req,res) => {
    try {
        const result = await templateServices.getById(req.params.id);

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

const getAll = async (req,res) => {
    try {
        const {page , limit , search = "" , category} = req.query;
        const result = await templateServices.getAll(page, limit, search, category);

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

const deleteOne = async (req,res) => {
    try {
        const result = await templateServices.deleteOne(req.params.id);
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
    create,
    update,
    getById,
    getAll,
    deleteOne
}