const { uploadToCloudinary } = require("../../middleware/cloudinary");
const PromotionalMaterials = require("../../model/promotionalMaterial");
const paginate = require("../../utils/pagination");
const mongoose = require("mongoose");

const PromotionalMaterialsServices = {
  create: async (data) => {
    const { country, userId, userName } = data;
    const checkExist = await PromotionalMaterials.findOne({ country });
    if (checkExist) {
      throw { status: false, message: "Promotional material for this country already exists" };
    }

    const newData = await PromotionalMaterials.create({
      country,
      documents: [],
      userId,
      userName
    })
    return newData;
  },

  addFolder: async (id, folderName, userId, userName) => {
    const material = await PromotionalMaterials.findById(id);
    if (!material) throw { status: false, message: "Promotional material not found" };

    const exists = material.documents.find((doc) => doc.folderName === folderName);
    if (exists) throw { status: false, message: "Folder already exists" };

    material.documents.push({ folderName, materials: [] });

    material.updated_by = userId;
    material.updatedByName = userName;

    await material.save();
    return material;
  },

  addDocument: async (materialId, folderName, materialName, urls, userId, userName) => {
    const material = await PromotionalMaterials.findById(materialId);
    if (!material) throw new Error("Promotional material not found");

    const folder = material.documents.find((doc) => doc.folderName === folderName);
    if (!folder) throw new Error("Folder not found");

    folder.materials.push({
      name: materialName,
      urls: urls, // Already an array of { link }
    });

    material.updated_by = userId;
    material.updatedByName = userName;

    await material.save();
    return material;
  },

update: async (id, docId, materialId, data, files) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid main document ID");
  }

  const material = await PromotionalMaterials.findById(id);
  if (!material) {
    throw new Error("Material not found");
  }

  let modified = false;

  // ✅ 1. Update country if changed
  if (data.country && data.country !== material.country) {
    const countryExists = await PromotionalMaterials.findOne({
      country: data.country,
      _id: { $ne: id },
    });
    if (countryExists) {
      throw new Error("Country already exists");
    }
    material.country = data.country;
    modified = true;
  }

  // ✅ 2. Update folder and material
  if (docId) {
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      throw new Error("Invalid folder ID");
    }

    const folder = material.documents.id(docId);
    if (!folder) {
      throw new Error("Folder not found");
    }

    // ✅ 2a. Update folderName
    if (data.folderName && data.folderName !== folder.folderName) {
      const nameExists = material.documents.some(
        (doc) =>
          doc._id.toString() !== docId &&
          doc.folderName.trim().toLowerCase() === data.folderName.trim().toLowerCase()
      );

      if (nameExists) {
        throw new Error("Folder with this name already exists");
      }

      folder.folderName = data.folderName;
      modified = true;
    }

    // ✅ 2b. Update material name or add files
    if (materialId) {
      const materialToUpdate = folder.materials.id(materialId);
      if (!materialToUpdate) {
        throw new Error("Material not found inside folder");
      }

      // Update name
      if (data.materialName && data.materialName !== materialToUpdate.name) {
        materialToUpdate.name = data.materialName;
        modified = true;
      }

      // Add files to this material
      if (files?.material?.length) {
        for (const file of files.material) {
          const cloudinaryRes = await uploadToCloudinary(
            file.buffer,
            file.mimetype,
            "materials"
          );
          materialToUpdate.urls.push({ link: cloudinaryRes.secure_url });
          modified = true;
        }
      }
    }
  }

  if (!modified) {
    throw new Error("No changes made. Check the inputs.");
  }

  await material.save();
  return material;
}
,



  deleteDocument: async (materialId, docId, fileId) => {
  if (!mongoose.Types.ObjectId.isValid(materialId)) {
    throw new Error("Invalid Promotional Material ID");
  }

  // 1️⃣ Delete specific file (only materialId, docId, fileId required)
  if (docId && fileId) {
    if (
      !mongoose.Types.ObjectId.isValid(docId) ||
      !mongoose.Types.ObjectId.isValid(fileId)
    ) {
      throw new Error("Invalid Folder ID or File ID");
    }

    const material = await PromotionalMaterials.findById(materialId);
    if (!material) throw new Error("Promotional material not found");

    const folder = material.documents.id(docId);
    if (!folder) throw new Error("Folder not found");

    let fileDeleted = false;

    for (const mat of folder.materials) {
      const originalLength = mat.urls.length;
      mat.urls = mat.urls.filter((file) => file._id.toString() !== fileId);

      if (mat.urls.length < originalLength) {
        fileDeleted = true;
        break; // stop after first match
      }
    }

    if (!fileDeleted) {
      throw new Error("File not found or already deleted");
    }

    await material.save();
    return { message: "File deleted from folder materials" };
  }

  // 2️⃣ Delete entire folder
  if (docId) {
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      throw new Error("Invalid Folder ID");
    }

    const result = await PromotionalMaterials.findByIdAndUpdate(
      materialId,
      { $pull: { documents: { _id: docId } } },
      { new: true }
    );

    if (!result) throw new Error("Folder not found for deletion");

    return { message: "Folder deleted from promotional material" };
  }

  // 3️⃣ Delete entire promotional material
  const result = await PromotionalMaterials.findByIdAndDelete(materialId);
  if (!result) {
    throw new Error("Promotional Material not found");
  }

  return { message: "Entire promotional material deleted successfully" };
},




  getOne: async (id, search) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: false, message: "Invalid ID format" };
    }
    const material = await PromotionalMaterials.findById(id);
    if (!material) {
      throw { status: false, message: "Promotional material not found" };
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");

      material.documents = material.documents.filter((doc) =>
        regex.test(doc.name)
      )
    }
    return material;
  },

  getAll: async (page, limit, searchText = "") => {
    const searchOptions = {
      searchText,
      searchFields: ["country", "documents.name"],
    };
    const getAll = await paginate(
      PromotionalMaterials,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );
    if (!getAll) {
      throw { status: false, message: "No promotional material found" };
    }
    return getAll;
  },
};

module.exports = PromotionalMaterialsServices;
