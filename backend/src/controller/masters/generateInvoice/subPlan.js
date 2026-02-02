const subPlanService = require("../../../services/masters/generateInvoice/subPlan");

const createPlan = async (req, res) => {
    try {
        const result = await subPlanService.create(req.body, req.user.userId, req.user.userName);
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
        });
    }
}

const updatePlan = async (req, res) => {
    try {
        const result = await subPlanService.update(req.params.id, req.body, req.user.userId, req.user.userName);
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
        });
    }
}

const getById = async (req, res) => {
    try {
        const result = await subPlanService.getById(req.params.id);
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
        });
    }
}

const getAll = async (req, res) => {
    try {
        const { page, limit, search = "", mainPlan , country } = req.query;
        const result = await subPlanService.getAll(page, limit, search, mainPlan, country);
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        console.log("error" , error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        });
    }
}

const deleteData = async (req, res) => {
    try {
        const result = await subPlanService.delete(req.params.id);
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
        });
    }
}

module.exports = {
    createPlan,
    updatePlan,
    getById,
    getAll,
    deleteData
};