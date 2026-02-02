const Document = require("../../../../model/masters/documentList/documents");

const mongoose = require("mongoose");
const paginate = require("../../../../utils/pagination");

const documentServices = {
  create: async (data, userId, userName) => {
    const existing = await Document.findOne({
        type: data.type,
        name: { $regex: `^${data.name}$`, $options: 'i' }
      });

    if (existing) {
      throw new Error(
        "Document with same name already exists under this type."
      );
    }

    const newDocument = await Document.create({
      type: data.type,
      name: data.name,
      created_by: userId,
      createdByName: userName,
    });

    return newDocument;
  },

  update: async (updateId, updateData, userId, userName) => {
    const existingDocument = await Document.findById(updateId);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    const duplicate = await Document.findOne({
      type: updateData.type || existingDocument.type,
      name: updateData.name || existingDocument.name,
      _id: { $ne: updateId },
    });

    if (duplicate) {
      throw new Error(
        "Another document with same name exists under this type."
      );
    }

    const updatedData = {
      ...updateData,
      updated_by: userId,
      updatedByName: userName,
    };

    const updatedDocument = await Document.findByIdAndUpdate(
      updateId,
      updatedData,
      { new: true }
    );

    return updatedDocument;
  },

  getAll: async (page, limit, searchText = "", type = "") => {
    const query = {};
    if (type) {
        if (mongoose.Types.ObjectId.isValid(type)) {
          query.type = new mongoose.Types.ObjectId(type);
        }
      }
    const searchOptions = { searchText, searchFields: ["name"] };

    const populateFields = [{path:"type" , select: "name"}];
    const getAll = await paginate(
      Document,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getAll) {
      throw { status: false, message: "No document found" };
    }

    return getAll;
  },
  delete: async (deleteId) => {
    const doc = await Document.findByIdAndDelete(deleteId);

    if (!doc) {
      throw { status: false, message: "Document not found" };
    }

    return "Document deleted successfully";
  },
};

module.exports = documentServices;
