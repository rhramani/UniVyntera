const branchServices = require("../../services/branch/branches");


const create = async (req, res) => {
    try {
        const {userId , userName} = req.user; 
        const result = await branchServices.create(req.body , userId, userName);

        res.status(201).json({
            status: true ,
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
        
const update = async (req, res) => {
    try {
       const {userId, userName} = req.user; 

       const result = await branchServices.update(req.params.id, req.body, userId, userName);

         res.status(200).json({
            status: true ,
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

const getOne = async (req,res) => {
    try {
        const result = await branchServices.getById(req.params.id);
         res.status(200).json({
            status: true ,
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

const getAll = async (req, res) => {
    try {
        const {page , limit, search = ""} = req.query;
        const result = await branchServices.getAll(page , limit, search);
         res.status(200).json({
            status: true ,
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

const deleteBranch = async (req,res) => {
    try {
        const result = await branchServices.delete(req.params.id);
        res.status(200).json({
            status: true ,
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
    create,
    update,
    getOne,
    getAll,
    deleteBranch
}