const currencyRateServices = require("../../services/masters/currencyRate");

const create = async (req, res) => {
    try {
        const { userId, userName } = req.user;
        let data = req.body;
        data.created_by = userId;
        data.createdByName = userName;
        const result = await currencyRateServices.create(data);

        return res.status(201).json({
            status: false,
            code: 201,
            message: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            error: error.message || "Something went wrong"
        })
    }
}


const bulkUploadCourse = async (req,res) => {
  try {
  
    const {userId , userName} = req.user;
    const file = req.files?.excelFile?.[0].path;

    if (!file) {
      return res.status(400).json({ status: false,code:400, message: "Excel file is required." });
    }
    const result = await currencyRateServices.bulkUploadCurrencyRate(file , userId, userName);

    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });    
    
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
}

const update = async (req, res) => {
    try {
        const data = req.body;
        const { userId, userName } = req.user;

        const result = await currencyRateServices.update(req.params.id ,data, userId, userName);
        return res.status(200).json({
            status: false,
            code: 200,
            message: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            error: error.message || "Something went wrong"
        })
    }
}

const getOne = async (req, res) => {
    try{
        const result = await currencyRateServices.getById(req.params.id);
        return res.status(200).json({
            status: false,
            code: 200,
            message: result
        })
    }catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            error: error.message || "Something went wrong"
        })
    }
}

const getAll = async (req,res) => {
    try{
        const result  = await currencyRateServices.getAll(req.query.search);
         return res.status(200).json({
            status: false,
            code: 200,
            message: result
        })
    } catch (error){
         res.status(500).json({
            status: false,
            code: 500,
            error: error.message || "Something went wrong"
        })
    }
}

const deleteData = async (req, res) => {
    try{
        const result  = await currencyRateServices.delete(req.params.id);
         return res.status(200).json({
            status: false,
            code: 200,
            message: result
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            error: error.message || "Something went wrong"
        })
    }
}

module.exports = {
    create,
    bulkUploadCourse,
    update,
    getAll,
    getOne,
    deleteData
}