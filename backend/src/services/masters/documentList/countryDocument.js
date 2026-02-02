const CountryDocument = require("../../../../model/masters/documentList/countryDocument");

const { buildCountryRegex } = require("../../../../helpers/countryNameMapping");
const { getAllCountriesFromPackage } = require("../../masters/instituteMaster");
const paginate = require("../../../../utils/pagination");

const assignDocumentServices = {
  create: async (data, userId, userName) => {
  let { country, documents } = data;

  // Filter valid document entries
  documents = documents.filter(
    (doc) =>
      doc &&
      doc.type &&
      Array.isArray(doc.documentList) &&
      doc.documentList.length > 0
  );

  // Normalize documentList to expected format
  documents = documents.map((doc) => ({
    type: doc.type,
    documentList: doc.documentList.map((d) => ({
      document: typeof d === "string" ? d : d.document,
      required: d.required || false,
    })),
  }));

  const upsertCountryDocuments = async (countryName) => {
    const existing = await CountryDocument.findOne({
      country: { $regex: new RegExp(`^${countryName}$`, "i") },
    });

    if (existing) {
      for (const newDoc of documents) {
        const existingDocType = existing.documents.find(
          (d) => d.type.toString() === newDoc.type.toString()
        );

        if (existingDocType) {
          const existingMap = new Map(
            existingDocType.documentList.map((doc) => [
              doc.document.toString(),
              doc.required,
            ])
          );

          for (const doc of newDoc.documentList) {
            existingMap.set(doc.document.toString(), doc.required || false);
          }

          existingDocType.documentList = Array.from(existingMap).map(
            ([document, required]) => ({ document, required })
          );
        } else {
          existing.documents.push(newDoc);
        }
      }

      existing.updated_by = userId;
      existing.updatedByName = userName;
      await existing.save();
      return existing;
    }

    // Create new entry
    const newEntry = await CountryDocument.create({
      country: countryName,
      documents,
      created_by: userId,
      createdByName: userName,
    });

    return newEntry;
  };

  // Assign to all countries
  if (country === "All") {
    const allCountries = await getAllCountriesFromPackage();
    const modifiedEntries = [];

    for (const c of allCountries) {
      const updatedEntry = await upsertCountryDocuments(c.name);
      modifiedEntries.push(updatedEntry);
    }

    return {
      status: true,
      message: `Documents successfully assigned to ${modifiedEntries.length} countries.`,
      data: modifiedEntries,
    };
  }

  // Assign to single country
  const result = await upsertCountryDocuments(country);

  return {
    status: true,
    message: "Country documents created/updated successfully.",
    data: result,
  };
},

  update: async (countryDocId, data, userId, userName) => {
    const { country, documents } = data;

    const existing = await CountryDocument.findById(countryDocId);

    if (!existing) {
      throw { status: false, message: "Country Document not found." };
    }

    const duplicate = await CountryDocument.findOne({
      country: { $regex: new RegExp(`^${country}$`, "i") },
      _id: { $ne: countryDocId },
    });

    if (duplicate) {
      throw {
        status: false,
        message: "Another record already assigned for this country.",
      };
    }

    const updatedEntry = await CountryDocument.findByIdAndUpdate(
      countryDocId,
      {
        country: country,
        documents,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return updatedEntry;
  },

  getAll: async (page, limit, searchText = "", country = "") => {
    const populateFields = [
      { path: "documents.type", select: "name" },
      {
        path: "documents.documentList.document",
        select: "name type",  
        populate: {
          path: "type",
          model: "DocumentType",
          select: "name",
        },
      },
    ];
    const searchOptions = { searchText, searchFields: ["country"] };

    const query = {};
    if (country) {
      const regex = buildCountryRegex(country);
      query.country = { $regex: regex };
    }

    const getAll = await paginate(
      CountryDocument,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getAll) {
      throw { status: false, message: "No data found" };
    }

    return getAll;
  },

  delete: async (deleteId) => {
    const doc = await CountryDocument.findByIdAndDelete(deleteId);

    if (!doc) {
      throw { status: false, message: "Document type not found" };
    }

    return "Document type deleted successfully";
  },
};

module.exports = assignDocumentServices;
