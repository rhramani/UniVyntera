const DocumentType = require("../../../../../model/masters/documentList/visitor/visitorDocumentType");

const paginate = require("../../../../../utils/pagination");

const documentTypeServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const existing = await DocumentType.findOne({name});

    if (existing) {
      throw (
        "Document type already exists"
      );
    }

    const newDocumentType = await DocumentType.create({
      name: data.name,
      created_by: userId,
      createdByName: userName,
    });

    return newDocumentType;
  },
  update: async (updateId, updateData, userId, userName) => {
    const { name } = updateData;
    const existingDocument = await DocumentType.findById(updateId);

    if (!existingDocument) {
      throw ("Document type not found");
    }

     if (name && name.trim() !== existingDocument.name) {
          const duplicate = await DocumentType.findOne({
            name: name.trim(),
            _id: { $ne: updateId },
          });
          if (duplicate) {
            throw { status: false, message: "Document type already exists" };
          }
        }


    const updatedData = {
      ...updateData,
      updated_by: userId,
      updatedByName: userName,
    };

    const updatedDocument = await DocumentType.findByIdAndUpdate(
      updateId,
      updatedData,
      { new: true }
    );

    return updatedDocument;
  },

  getAll: async (page, limit, searchText = "") => {
    
    const searchOptions = { searchText, searchFields: ["name"] };
    

    const getAll = await paginate(
      DocumentType,
      {},
      page, 
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      throw { status: false, message: "No document type found" };
    }

    return getAll;
  },
  delete : async (deleteId) => {
    const doc = await DocumentType.findByIdAndDelete(deleteId);
    
        if (!doc) {
          throw { status: false, message: "Document type not found" };
        }
    
        return "Document type deleted successfully";
  }
};

module.exports = documentTypeServices;
