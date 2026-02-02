const inquiryServices = require("../../../services/masters/lead/inquiry");

const createInquiry = async (req,res) => {
    try {
        const result = await inquiryServices.createInquiry(req.body, req.user?.userId, req.user?.userName);

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

const updateInquiry = async (req,res) => {
    try {
        const result = await inquiryServices.updateInquiry(req.params.id, req.body, req.user?.userId, req.user?.userName);
        
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



const getAllInquiry = async (req,res) => {
    try {
        const {page , limit , search = ""} = req.query;
        const result = await inquiryServices.getAllInquiry(page, limit, search);

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



const deleteInquiry = async (req,res) => {
    try {
        const result = await inquiryServices.deleteInquiry(req.params.id);
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
    createInquiry,
    updateInquiry,
    getAllInquiry,
    deleteInquiry
}