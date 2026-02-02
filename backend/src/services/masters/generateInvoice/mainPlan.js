const MainPlan = require("../../../../model/masters/generateInvoice/mainPlan");
const paginate = require("../../../../utils/pagination");

const mainPlanServices = {
  create: async (data, userId, userName) => {
      const { name } = data;
  
      const nameExist = await MainPlan.findOne({ name });
      if (nameExist) {
        throw {
          status: false,
          message: "Main Plan with this name already exists",
        };
      }
  
      const newMainPlan = await MainPlan.create({
        name,
        created_by: userId,
        createdByName: userName
      });
  
      return newMainPlan;
    },


  getAll: async (page , limit , searchText = "") => {
   const searchOptions = {
      searchText,
      searchFields: ["name"],
    };
    const allStatus = await paginate(
        MainPlan,
        {},
        page ,
        limit,
        {createdAt: -1},
        [],
        searchOptions
    )
  
    return allStatus;
  },

  getById: async (id) => {
    const status = await MainPlan.findById(id);
    if (!status) {
      throw { status: false, message: "Main plan not found" };
    }
    return status;
  },


  update: async (id, data, userId, userName) => {
    const { name } = data;
  
    const Status = await MainPlan.findById(id);
    if (!Status) {
      throw { status: false, message: "Main plan not found" };
    }
  
    if (name) {
      const nameExist = await MainPlan.findOne({ 
        name, 
        _id: { $ne: id } 
      });
      if (nameExist) {
        throw { status: false, message: "Main plan with this name already exists" };
      }
    }
  
    const updateData = await MainPlan.findByIdAndUpdate(
      id,
      { ...data,
        updated_by: userId,
        updatedByName: userName
       },
      { new: true }
    );
  
    return updateData;
  },

  delete: async (id) => {
    const deleted = await MainPlan.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Main plan not found or already deleted",
      };
    }
    return "Main plan deleted successfully";
  },
};

module.exports = mainPlanServices;
