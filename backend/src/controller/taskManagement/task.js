const taskServices = require("../../services/taskManagement/task");


const create = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    let data = { ...req.body };

    // ===============================
    // FIX OBJECTID SINGLE FIELDS
    // ===============================
    const objectIdFields = [
      "branch",
      "role",
      "category",
      "priority",
      "type",
      "status",
    ];

    objectIdFields.forEach((field) => {
      if (
        data[field] === "null" ||
        data[field] === "" ||
        data[field] === undefined
      ) {
        data[field] = null;
      }
    });

    // ===============================
    // FIX USER FIELD (ObjectId Array)
    // ===============================
    if (data.user) {
      if (typeof data.user === "string") {
        try {
          data.user = JSON.parse(data.user);
        } catch {
          data.user = [data.user];
        }
      }

      if (!Array.isArray(data.user)) {
        data.user = [data.user];
      }
    }

    // ===============================
    // FIX EMPTY STRINGS (OPTIONAL)
    // ===============================
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        data[key] = null;
      }
    });

    // ===============================
    // FILE UPLOAD
    // ===============================
    if (req.files?.taskDoc?.length > 0) {
      const fullPath = req.files.taskDoc[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.document =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    // ===============================
    // CREATE TASK
    // ===============================
    const result = await taskServices.create(data, userId, userName);

    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

 
const update = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    const updateId = req.params.id;

    let data = { ...req.body };

    // ===============================
    // FIX OBJECTID SINGLE FIELDS
    // ===============================
    const objectIdFields = [
      "branch",
      "role",
      "category",
      "priority",
      "type",
      "status",
    ];

    objectIdFields.forEach((field) => {
      if (
        data[field] === "null" ||
        data[field] === "" ||
        data[field] === undefined
      ) {
       delete data[field];
      }
    });

    // ===============================
    // FIX USER FIELD (ObjectId Array)
    // ===============================
    if (data.user) {
      if (typeof data.user === "string") {
        try {
          data.user = JSON.parse(data.user);
        } catch {
          data.user = [data.user];
        }
      }

      if (!Array.isArray(data.user)) {
        data.user = [data.user];
      }
    }

    // ===============================
    // FILE UPDATE (taskDoc)
    // ===============================
    if (req.files?.taskDoc?.length > 0) {
      const fullPath = req.files.taskDoc[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      data.document =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    // ===============================
    // REMOVE UNDEFINED KEYS (IMPORTANT)
    // ===============================
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const result = await taskServices.update(
      updateId,
      data,
      userId,
      userName
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getOne = async (req,res) => {
    try {
        const result = await taskServices.getById(req.params.id);
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
        const {page , limit, search = "" , showAll, branchId, role,user, status, category, priority, type} = req.query;
        const result = await taskServices.getAll(page , limit, search ,showAll,branchId,role,user, status,category,priority,type,req.user);
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

const deleteData = async (req,res) => {
    try {
        const result = await taskServices.delete(req.params.id);
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
    deleteData
}