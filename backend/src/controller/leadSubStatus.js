const leadStatusServices = require("../services/leadSubStatus");


const create = async (req,res) => {
    try {
        const result = await leadStatusServices.create(req.body, req.user?.userId, req.user?.userName);
        return res.status(201).json({
            status: true,
            code: 201,
            data: result
        })
    } catch (error) {
        if (error.code === 11000) {
        throw {
          status: false,
          message:
            "Status with this same name and color alredy exist.",
        };
      }
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const update = async (req,res) => {
    try {
        const result = await leadStatusServices.update(req.params.id, req.body, req.user?.userId, req.user?.userName)
        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        })
    } catch (error) {
        if (error.code === 11000) {
        throw {
          status: false,
          message:
            "Status with this same name and color alredy exist.",
        };
      }
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}

const getOne = async (req,res) => {
    try {
        const {mainTab} = req.query;
        const result = await leadStatusServices.getOne(mainTab);
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
        const { page, limit , search } = req.query;
        const result = await leadStatusServices.getAll(page , limit , search);
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

const deleteRecord = async (req,res) => {
    try {
        const result = await leadStatusServices.delete(req.params.id);
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
    create,
    update,
    getOne,
    getAll,
    deleteRecord
}