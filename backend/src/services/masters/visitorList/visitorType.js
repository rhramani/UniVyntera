const VisitorType = require("../../../../model/masters/visitorList/visitorType");

const paginate = require("../../../../utils/pagination");
const { update } = require("../../../controller/leadStatus");

const visitorTypeServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const existing = await VisitorType.findOne({name});

    if (existing) {
      throw (
        "Visitor type already exists"
      );
    }

    const newVisitorType = await VisitorType.create({
      name: data.name,
      created_by: userId,
      createdByName: userName,
    });

    return newVisitorType;
  },
  update: async (updateId, updateData, userId, userName) => {
    const { name } = updateData;
    const existingVisitor = await VisitorType.findById(updateId);

    if (!existingVisitor) {
      throw ("Visitor type not found");
    }

     if (name && name.trim() !== existingVisitor.name) {
          const duplicate = await VisitorType.findOne({
            name: name.trim(),
            _id: { $ne: updateId },
          });
          if (duplicate) {
            throw { status: false, message: "Visitor type already exists" };
          }
        }


    const updatedData = {
      ...updateData,
      updated_by: userId,
      updatedByName: userName,
    };

    const updatedVisitor = await VisitorType.findByIdAndUpdate(
      updateId,
      updatedData,
      { new: true }
    );

    return updatedVisitor;
  },

  getAll: async (page, limit, searchText = "") => {
    
    const searchOptions = { searchText, searchFields: ["name"] };
    

    const getAll = await paginate(
      VisitorType,
      {},
      page, 
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      throw { status: false, message: "No visitor type found" };
    }

    return getAll;
  },
  delete : async (deleteId) => {
    const doc = await VisitorType.findByIdAndDelete(deleteId);
    
        if (!doc) {
          throw { status: false, message: "Visitor type not found" };
        }
    
        return "Visitor type deleted successfully";
  }
};

module.exports = visitorTypeServices;
