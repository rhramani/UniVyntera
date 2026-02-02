const subModuleServices = require("../services/subModules");

const createSubModule = async (req, res) => {
    try {
        const result = await subModuleServices.createSubModule(req.body);

        return res.status(201).json({
            status: true,
            code: 201,
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "Something went wrong"
        })
    }
}

const updateSubModule = async (req,res) => {
    try {
        const result = await subModuleServices.updateSubModule(req.params.id , req.body);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "Something went wrong"
        })
    }
}

const getSubModuleById = async (req,res) => {
    try {
        const result = await subModuleServices.getSubModuleById(req.params.id);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "Something went wrong"
        })
    }
}

const getAllSubModules = async (req,res) => {
    try {
        const result = await subModuleServices.getAllSubModules();

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "Something went wrong"
        })
    }
}

const deleteSubModuleById = async (req,res) => {
    try {
        const result = await subModuleServices.deleteSubModuleById(req.params.id);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "Something went wrong"
        })
    }
}

module.exports = {
    createSubModule,
    updateSubModule,
    getSubModuleById,
    getAllSubModules,
    deleteSubModuleById
}   