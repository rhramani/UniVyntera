const fundTransferServices = require("../services/fundTransfer");
const { uploadToCloudinary } = require("../../middleware/cloudinary");

const create = async (req, res) => {
    try{
        let data = req.body;
        
        if(req.files?.fundTransfer?.[0]){
            const cloudinaryRes  = await uploadToCloudinary(req.files.fundTransfer[0].buffer, req.files.fundTransfer[0].mimetype, "settings");
            data.proof = cloudinaryRes.secure_url;
        }
 const {userId, userName} = req.user;
        data.created_by = userId;
        data.createdByName = userName;
        const result = await fundTransferServices.create(
            data
        );

        res.status(201).json({
            status: true,
            message: "Fund transfer created successfully",
            data: result
        })
    }catch(error){
        console.error("Error in fund transfer creation:", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
};

const get = async (req, res) => {
    try{
        const { page, limit, startDate= "" ,endDate = "" } = req.query;
        const result = await fundTransferServices.get(page, limit, startDate,endDate);

        return res.status(200).json({
            status: false,
            code: 200,
            data: result
        })
    }catch(error){
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}


module.exports = {
    create,
    get
};