const clientMail = require("../../model/clientMail");
const Category = require("../../model/clientMailCategory");

const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const paginate = require("../../utils/pagination");

const clientMailService = {
  create: async (data, userId, userName) => {
    const { category, email } = data;

    // Check if email already exists
    if (category && email) {
      const emailExist = await clientMail.findOne({ category, email });
      if (emailExist) {
        throw {
          status: false,
          message:
            "Client Mail with this email already exists in this category",
        };
      }
    }

    const newClientMail = await clientMail.create({
      ...data,
      created_by: userId,
      createdByName: userName,
    });

    return newClientMail;
  },

  getAll: async (page, limit, searchText = "", categoryId = null) => {
    const searchOptions = { searchText, searchFields: ["name"] };

    const query = {};
    if (categoryId) {
      query.category = new mongoose.Types.ObjectId(categoryId);
    }
    const result = await paginate(
      clientMail,
      query,
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    return result;
  },

  getById: async (id) => {
    const clientMails = await clientMail.findById(id);
    if (!clientMails) {
      throw { status: false, message: "Client Mail not found" };
    }
    return clientMails;
  },

  update: async (id, data, userId, userName) => {
    const { name, email, contact, category } = data;

    // Check if clientMail with provided ID exists
    const clientMails = await clientMail.findById(id);
    if (!clientMails) {
      throw { status: false, message: "Client Mail not found" };
    }

    // Check if email is already taken by another clientMail
    if (email) {
      const emailExist = await clientMail.findOne({
        email,
        category: category || clientMails.category, // use new category if provided, else old one
        _id: { $ne: id }, // Exclude current record
      });

      if (emailExist) {
        throw {
          status: false,
          message:
            "Client Mail with this email already exists in this category",
        };
      }
    }

    const updatedClientMail = await clientMail.findByIdAndUpdate(
      id,
      {
        ...data,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true, runValidators: true }
    );

    return updatedClientMail;
  },

  delete: async (id) => {
    const deleted = await clientMail.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Client Mail not found or already deleted",
      };
    }
    return "Client Mail deleted successfully";
  },
  bulkUploadClientMail: async (file, userId, userName) => {
    const workbook = xlsx.readFile(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows || rows.length === 0) {
      throw { status: false, message: "Uploaded sheet is empty" };
    }

    const formattedData = [];
    const seen = new Set();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 2; // Excel row number

      const name = row["Name"]?.trim() || "";
      const email = row["Email"]?.trim().toLowerCase() || "";
      const contact = row["Contact"]|| "";
      const categoryName = row["Category"]?.trim();

      if (!email) {
        throw { status: false, message: `Email is missing in row ${rowIndex}` };
      }
      if (!categoryName) {
        throw {
          status: false,
          message: `Category is missing in row ${rowIndex}`,
        };
      }

      //Find or create category
      let category = await Category.findOne({
        name: new RegExp(`^${categoryName}$`, "i"),
      });
      if (!category) {
        category = await Category.create({ name: categoryName , created_by: userId, createdByName: userName});
      }

      const key = `${email}-${category._id}`;

      // Check duplicates inside the file
      if (seen.has(key)) {
        throw {
          status: false,
          message: `Duplicate email "${email}" found in file for category "${categoryName}" (row ${rowIndex})`,
        };
      }
      seen.add(key);

      formattedData.push({
        name,
        email,
        contact,
        category: category._id,
        created_by: userId,
        createdByName: userName,
      });
    }

    // Check duplicates in DB (skip them)
    const existing = await clientMail.find({
      email: { $in: formattedData.map((d) => d.email) },
      category: { $in: formattedData.map((d) => d.category) },
    });

    const existingKeys = new Set(
      existing.map((e) => `${e.email}-${e.category}`)
    );

    const finalData = formattedData.filter(
      (d) => !existingKeys.has(`${d.email}-${d.category}`)
    );

    if (finalData.length === 0) {
      return {
        status: false,
        message:
          "All emails already exist in their categories. Nothing to insert.",
      };
    }

    await clientMail.insertMany(finalData);

    return `Client data uploaded successfully. Inserted ${finalData.length} records. Skipped ${existing.length} existing records.`;
  },
};

module.exports = clientMailService;
