const StudentInvoiceServices = require("../services/studentInvoice");
const path = require("path");
const createInvoice = async (req, res) => {
    try {
        const result = await StudentInvoiceServices.create(req.body, req.user.userId, req.user.userName);
        return res.status(201).json({
            status: true,
            code: 201,
            message: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const updateInvoice = async (req, res) => {
    try {
        const result = await StudentInvoiceServices.update(req.params.id, req.body);

        return res.status(200).json({
            status: true,
            code: 200,
            message: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const getAllInvoice = async (req, res) => {
    try {
        const { page, limit, search, b2bId, startDate, endDate , status} = req.query;
        const result = await StudentInvoiceServices.getAll(req.user, page, limit, search, b2bId, startDate, endDate, status);
        return res.status(200).json({
            status: true,
            code: 200,
            message: result
        })
    } catch (error) {
        console.log("Errroorrrr", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const deleteInvoice = async (req, res) => {
    try {
        const result = await StudentInvoiceServices.delete(req.params.id);
        return res.status(200).json({
            status: true,
            code: 200,
            message: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const exportDataToExcel = async (req, res) => {
    try {
        const ids = req.query.ids?.split(",") || [];
        const result = await StudentInvoiceServices.exportDataToExcel(ids);

        if (!result.success) {
            return res.status(404).json({
                status: false,
                message: result.message,
            })
        }
        const fileName = path.basename(result.filePath);
        const fileUrl = `/public/${fileName}`;

        return res.status(200).json({
            status: true,
            code: 200,
            fileUrl
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message
        });
    }
}

module.exports = {
    createInvoice,
    updateInvoice,
    getAllInvoice,
    deleteInvoice,
    exportDataToExcel
}   