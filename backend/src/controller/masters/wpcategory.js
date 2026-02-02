const categoryServices = require("../../services/masters/wpcategory");

const create = async (req,res) => {
    try {
        const result = await categoryServices.create(req.body, req.user?.userId, req.user?.userName);

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
        const result = await categoryServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);
        
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
        const result = await categoryServices.getById(req.params.id);

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
        const {page , limit , search = ""} = req.query;
        const result = await categoryServices.getAll(page, limit, search);

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
        const result = await categoryServices.deleteOne(req.params.id);
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