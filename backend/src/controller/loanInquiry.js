const LoanInquiryServices = require("../services/loanInquiry");

const create = async (req, res) => {
    try {
        const data = req.body;

        // Add user tracking if needed
        data.created_by = req.user?.userId || null;
        data.createdByName = req.user?.userName || null;

        const result = await LoanInquiryServices.create(data);

        return res.status(201).json({
            status: true,
            message: "Loan inquiry created successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || "Something went wrong",
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { userId , userName } = req.user;
        const result = await LoanInquiryServices.update(id, data , userId,userName );

        return res.status(200).json({
            status: true,
            message: "Loan inquiry updated successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || "Something went wrong",
        });
    }
};

const getAll = async (req, res) => {
    try {
        const { page, limit, search = "", startDate, endDate } = req.query;

   
        const result = await LoanInquiryServices.getAll(
            page,
            limit,
            search,
            startDate,
             endDate
        );
        return res.status(200).json({
            status: true,
            code: 200,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }
}

const getById = async (req, res) => {
    try {
        const result = await LoanInquiryServices.getById(req.params.id);
        return res.status(200).json({
            status: true,
            code: 200,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }
}

const deleteData = async (req,res) => {
    try {
        const result = await LoanInquiryServices.delete(req.params.id);
        return res.status(200).json({
            status: true,
            code: 200,
            data: result,
        });
    } catch (error) {
         return res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        });
    }
}

module.exports = {
    create,
    update,
    getAll,
    getById,
    deleteData
}