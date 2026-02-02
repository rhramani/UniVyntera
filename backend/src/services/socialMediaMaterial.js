const { uploadToCloudinary } = require("../../middleware/cloudinary");
const SocialMediaMaterials = require("../../model/socialMediaMaterial");
const paginate = require("../../utils/pagination");
const mongoose = require("mongoose");

const SocialMediaMaterialsServices = {
  create: async (data) => {
    const { country, userId, userName } = data;
    const checkExist = await SocialMediaMaterials.findOne({ country });
    if (checkExist) {
      throw { status: false, message: "Social media material for this country already exists" };
    }

    const newData = await SocialMediaMaterials.create({
      country,
      documents: [],
      userId,
      userName
    })
    return newData;
  },
addDocument: async (materialId, newDoc, userId, userName) => {
  const material = await SocialMediaMaterials.findById(materialId);
  if (!material) {
    throw new Error("Social media material not found");
  }

  const urls = newDoc.urls || [];

  if (!urls.length) {
    throw new Error("No document URLs provided.");
  }

  for (const [index, link] of urls.entries()) {
    const docName = newDoc.name;

 

    material.documents.push({
      name: docName,
      urls: [
        {
          _id: new mongoose.Types.ObjectId(),
          link: link
        }
      ]
    });
  }

  material.updated_by = userId;
  material.updatedByName = userName;

  await material.save();
  return material;
},


 update: async (id, docId, data, files) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid main document ID");
  }

  const material = await SocialMediaMaterials.findById(id);
  if (!material) {
    throw new Error("Material not found");
  }

  let modified = false;

  // ✅ 1. Update country if changed
  if (data.country && data.country !== material.country) {
    const countryExists = await SocialMediaMaterials.findOne({
      country: data.country,
      _id: { $ne: id }
    });

    if (countryExists) {
      throw new Error("Country already exists");
    }

    material.country = data.country;
    modified = true;
  }

  // ✅ 2. Update specific document
  if (docId) {
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      throw new Error("Invalid subdocument ID");
    }

    const document = material.documents.id(docId);
    if (!document) {
      throw new Error("Document not found in this material");
    }

    // 🔁 2.a. Update document name (ensure no duplicate within same country)
    if (data.materialName && data.materialName !== document.name) {
      const nameExists = material.documents.some(
        doc =>
          doc._id.toString() !== docId &&
          doc.name.trim().toLowerCase() === data.materialName.trim().toLowerCase()
      );

      if (nameExists) {
        throw new Error("Document with this name already exists in this country");
      }

      document.name = data.materialName;
      modified = true;
    }

    // 🔁 2.b. Append new files to document.urls
    if (files?.material?.length) {
      for (const file of files.material) {
        const cloudinaryRes = await uploadToCloudinary(
          file.buffer,
          file.mimetype,
          "materials"
        );

        // Add new entry with _id and link
        document.urls.push({
          _id: new mongoose.Types.ObjectId(),
          link: cloudinaryRes.secure_url
        });

        modified = true;
      }
    }
  }

  if (!modified) {
    throw new Error("No changes made. Check the inputs.");
  }

  await material.save();
  return material;
},



 deleteDocument: async (materialId, docId, fileId) => {
  if (!mongoose.Types.ObjectId.isValid(materialId)) {
    throw new Error("Invalid Promotional Material ID");
  }

  // 1️⃣ Delete specific file (by fileId) inside a document (by docId)
  if (docId && fileId) {
    if (!mongoose.Types.ObjectId.isValid(docId) || !mongoose.Types.ObjectId.isValid(fileId)) {
      throw new Error("Invalid Document ID or File ID");
    }

    const result = await SocialMediaMaterials.updateOne(
      { _id: materialId, "documents._id": docId },
      {
        $pull: {
          "documents.$.urls": { _id: fileId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error("File not found or already deleted");
    }

    return { message: "File deleted from document" };
  }

  // 2️⃣ Delete an entire document (by docId) inside a material
  if (docId) {
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      throw new Error("Invalid Document ID");
    }

    const result = await SocialMediaMaterials.findByIdAndUpdate(
      materialId,
      { $pull: { documents: { _id: docId } } },
      { new: true }
    );

    if (!result) {
      throw new Error("Document not found for deletion");
    }

    return { message: "Document deleted from material" };
  }

  // 3️⃣ Delete entire Promotional Material (country-level)
  const result = await SocialMediaMaterials.findByIdAndDelete(materialId);
  if (!result) {
    throw new Error("Promotional Material not found");
  }

  return { message: "Entire promotional material deleted successfully" };
},



  getOne: async (id, search) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: false, message: "Invalid ID format" };
    }
    const material  = await SocialMediaMaterials.findById(id);
    if (!material ) {
      throw { status: false, message: "Social media material not found" };
    }

    if(search && search.trim() !== ""){
      const regex = new RegExp(search.trim(), "i");

      material.documents = material.documents.filter((doc) => 
        regex.test(doc.name)
      )
    }
    return material ;
  },

  getAll: async (page, limit, searchText = "") => {
    const searchOptions = {
      searchText,
      searchFields: ["country", "documents.name"],
    };
    const getAll = await paginate(
      SocialMediaMaterials,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );
    if (!getAll) {
      throw { status: false, message: "No social media material found" };
    }
    return getAll;
  },
};

module.exports = SocialMediaMaterialsServices;
 