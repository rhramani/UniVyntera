const bankingServices = require("../../services/masters/banking");

const createBanking = async (req, res) => {
    try {
        const result = await bankingServices.create(req.body, req.user?.userId, req.user?.userName);

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

const updateBanking = async (req, res) => {
    try {
        const result = await bankingServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);

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

const getAllBanking = async (req,res) => {
    try {
        const {page , limit , search = ""} = req.query;
        const result = await bankingServices.getAll(page, limit, search);

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

const deleteBanking = async (req,res) =>{
    try {
        const result = await bankingServices.delete(req.params.id);
        
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
    createBanking,
    updateBanking,
    getAllBanking,
    deleteBanking
}