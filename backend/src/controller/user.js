const userServices = require("../services/user");

const userRegistration = async (req,res) => {
    try {
        const { userId, userName} = req.user;
        const result = await userServices.register(req.body, req.files, userId, userName);

        return res.status(201).json({
            message : "User registered successfully",
            code : 201,
            data : result
        })
        
    } catch (error) {

        res.status(500).json({
            status: false,
            code: 500 ,
            message: error.message ||  "Something went wrong",
        })
    }
}

const requestOTP = async (req, res) => {
    try {
        await userServices.requestOTP(req.body.email);

        return res.status(201).json({
            message : "OTP sent successfully",
            code : 200  
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500 ,
            message: error.message ||  "Something went wrong",
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const result = await userServices.login(req.body, req);

        return res.status(200).json({
            message: "User login succesfully",
            code: 200,
            data: result
        })

    } catch (error) {
        console.log("errorr" , error);
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong",
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        const files = req.files;
        const { userId , userName } = req.user;
        const result = await userServices.updateUser(id , updateData, files, userId , userName);

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
        })
    }
}

const getOneUser = async (req,res) => {
    try {
        const result = await userServices.getOneUser(req.params.id);

        return res.status(200).json({
            status: true,
            code:200,
            data:result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const getAllUser = async (req,res) => {
    try {
        const {page, limit, search = "", role = "" , branchId = "" , showAll} = req.query;
        const result = await userServices.getAllUser(page, limit, search, role, branchId , showAll);
        
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

const getAllCounselor = async (req,res) => {
    try {
        const result = await userServices.getAllCounselors(req.params.id);
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

const deleteUser = async (req,res) => {
    try {
        const result = await userServices.deleteUser(req.params.id, req.user.userId);
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



const getLoginHistory = async (req,res) => {
    try {
        const {page , limit} = req.query;
        const result = await userServices.getLoginHistory(page,limit);

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


const globalIpRestriction = async (req, res) => {
    try{
        const result = await userServices.globalIpRestriction(req.user.role, req.body);

        return res.status(200).json({
            status: true,
            code: 200,
            message: result
        })
    }catch (error){
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

module.exports = {
    userRegistration,
    requestOTP,
    userLogin,
    updateUser,
    getOneUser,
    getAllUser,
    getAllCounselor,
    deleteUser,
    getLoginHistory,
    globalIpRestriction
}