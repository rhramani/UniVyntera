const campusServices = require("../../services/masters/campusMaster");

const createCampus = async (req, res) => {
  try {
    const data = req.body;
    data.created_by = req.user?.userId;
    data.createdByName = req.user?.userName;

    const result = await campusServices.createCampus(data);
    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Failed to create campus",
    });
  }
};

const updateCampus = async (req, res) => {
  try {
      const result = await campusServices.updateCampus(req.params.id, req.body, req.user?.userId, req.user?.userName);

      return res.status(200).json({
          status: true,
          code: 200,
          data: result,
      });
      
  } catch (error) {
      
      if (error.code === 11000) {
          return res.status(400).json({
              status: false,
              code: 400,
              message: "Campus with the same name already exists in this country.",
          });
      }

      res.status(500).json({
          status: false,
          code: 500,
          message: error.message || "Something went wrong",
      });
  }
}


const getAllCampuses = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;

    const result = await campusServices.getAllCampuses(page, limit, search);

    res.status(200).json({
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
};

const deleteCampus = async (req, res) => {
  try {
    await campusServices.deleteCampus(req.params.id);
    res.status(200).json({ status: true,code:200, message: "Campus deleted" });
  } catch (error) {
    res.status(500).json({ status: false,code:500, message: error.message });
  }
};


const getCampusByCountry = async (req, res) => {
  try {
      const { country } = req.query; // or use req.params if you send in URL

      if (!country) {
          return res.status(400).json({
              status: false,
              code: 400,
              message: "Country name is required",
          });
      }

      const result = await campusServices.getCampusByCountry(country);

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
  createCampus,
  updateCampus,
  getAllCampuses,
  deleteCampus,
  getCampusByCountry
};
