const crmSettingServices = require("../services/crmSettings");
const { uploadToCloudinary } = require("../../middleware/cloudinary");

const create = async (req,res) => {
    try {
        let data = req.body;

        const {userId, userName} = req.user;
        data.created_by = userId;
        data.createdByName = userName;
        const result = await crmSettingServices.create(data);

        return res.status(201).json({
            status: true,
            code: 201,
            data: result,
          });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
          });
    }
}

const update = async (req,res) => {
    try {
        let data = req.body;
        const { userId , userName} = req.user;
     
        data.updated_by = userId;
        data.updatedByName = userName;

        const result = await crmSettingServices.update(data);

        return res.status(200).json({
            status: true,
            code: 200,
            data: result,
          });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
          });
    }
}

const getAll = async (req,res) => {
    try {
        const result = await crmSettingServices.getAll();
        return res.status(200).json({
            status: true,
            code: 200,
            data: result,
          });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
          });
    }
}

const deleteData = async (req,res) => {
    try {
       const result = await crmSettingServices.delete(req.params.id); 
        return res.status(200).json({
            status: true,
            code: 200,
            data: result,
          });
    } catch (error) {
        res.status(500).json({
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
    deleteData
};