const mainPlanServices = require("../../../services/masters/generateInvoice/mainPlan");

const mainPlanController = {
    create: async (req, res) => {
        try {
            const newStatus = await mainPlanServices.create(
                req.body,
                req.user?.userId,
                req.user?.userName
            );
            res
                .status(201)
                .json({
                    status: true,
                    code: 201,
                    data: newStatus,
                });
        } catch (error) {
            if (error.code === 11000) {
                throw {
                    status: false,
                    message:
                        "Status with this name already exists under the same main tab.",
                };
            }
            res
                .status(400)
                .json({
                    status: false,
                    message: error.message || "Something went wrong",
                });
        }
    },

    getAll: async (req, res) => {
        try {
            const {page , limit , search} = req.query;
            const statuses = await mainPlanServices.getAll(page ,limit , search);
            res.status(200).json({ status: true, data: statuses });
        } catch (error) {
            res
                .status(400)
                .json({
                    status: false,
                    message: error.message || "Something went wrong",
                });
        }
    },

    getById: async (req, res) => {
        try {
            const status = await mainPlanServices.getById(
                req.params.id
            );
            res.status(200).json({ status: true, data: status });
        } catch (error) {
            res
                .status(404)
                .json({
                    status: false,
                    message: error.message || "Something went wrong",
                });
        }
    },

    update: async (req, res) => {
        try {
            const updated = await mainPlanServices.update(
                req.params.id,
                req.body,
                req.user?.userId,
                req.user?.userName
            );
            res
                .status(200)
                .json({
                    status: true,
                    message: "Status updated successfully",
                    data: updated,
                });
        } catch (error) {
            if (error.code === 11000) {
                throw {
                    status: false,
                    message:
                        "Status with this name already exists under the same main tab.",
                };
            }
            res
                .status(400)
                .json({
                    status: false,
                    message: error.message || "Something went wrong",
                });
        }
    },

    deleteData: async (req, res) => {
        try {
            const deleted = await mainPlanServices.delete(
                req.params.id
            );
            res.status(200).json({ status: true,code:200, message: deleted });
        } catch (error) {
            res
                .status(500)
                .json({
                    status: false,
                    code:500,
                    message: error.message || "Something went wrong",
                });
        }
    },
};

module.exports = mainPlanController;
