const credentialServices = require("../../services/waDaddy/credentials");

const create = async (req, res) => {
    try {

        const result = await credentialServices.create(req.body , req.user?.userId, req.user?.userName);
        
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
        })
    }
}

const update = async (req,res) => {
    try {
        const result = await credentialServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName);

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

const getAll = async (req,res) => {
    try {
        const result = await credentialServices.getAll();

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


module.exports = { create, update, getAll };