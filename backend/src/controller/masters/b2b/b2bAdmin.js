const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const b2bAdminServices = require("../../../services/masters/b2b/b2bAdmin");
const { uploadToCloudinary } = require("../../../../middleware/cloudinary");

const normalizePath = (fullPath) => {
  const uploadIndex = fullPath.indexOf("uploads");
  let path =
    uploadIndex !== -1
      ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
      : fullPath.replace(/\\/g, "/");

  return path.startsWith("/") ? path : `/${path}`;
};

const createB2bAdmin = async (req, res) => {
  try {
    const data = req.body;

    // if (req.files?.logo?.[0]) {
    //  const cloudinaryRes = await uploadToCloudinary(req.files.logo[0].buffer,req.files.logo[0].mimetype, "b2b" );
    //   data.companyLogo = cloudinaryRes.secure_url;
    //   data.companyLogoPublicId = cloudinaryRes.public_id;
    // }
    if (req.files && req.files?.logo && req.files?.logo?.length > 0) {
      const fullPath = req.files.logo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      let relativePath =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath.replace(/\\/g, "/");

      // ✅ ensure leading slash
      data.companyLogo = relativePath.startsWith("/")
        ? relativePath
        : `/${relativePath}`;
    }
    // if (req.files?.cancelCheque?.[0]) {
    //    const cloudinaryRes = await uploadToCloudinary(req.files.cancelCheque[0].buffer,req.files.cancelCheque[0].mimetype, "b2b");
    //   data.cancelChequeImage = cloudinaryRes.secure_url;
    //   data.cancelChequeImagePublicId = cloudinaryRes.public_id;
    // }
    if (
      req.files &&
      req.files?.cancelCheque &&
      req.files?.cancelCheque?.length > 0
    ) {
      const fullPath = req.files.cancelCheque[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      let relativePath =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath.replace(/\\/g, "/");

      // ✅ ensure leading slash
      data.cancelChequeImage = relativePath.startsWith("/")
        ? relativePath
        : `/${relativePath}`;
    }
    data.created_by = req.user?.userId;
    data.createdByName = req.user?.userName;

    const result = await b2bAdminServices.create(data);

    return res.status(200).json({
      status: true,
      code: 201,
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
const updateB2BAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const { userId, userName } = req.user;

    // if (req.files?.logo?.[0]) {
    //   const cloudinaryRes = await uploadToCloudinary(req.files.logo[0].buffer,req.files.logo[0].mimetype, "b2b" );
    //   data.companyLogo = cloudinaryRes.secure_url;
    // }
    if (req.files && req.files?.logo && req.files?.logo?.length > 0) {
      const fullPath = req.files.logo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      let relativePath =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath.replace(/\\/g, "/");

      // ✅ ensure leading slash
      data.companyLogo = relativePath.startsWith("/")
        ? relativePath
        : `/${relativePath}`;
    }
    // if (req.files?.cancelCheque?.[0]) {
    //  const cloudinaryRes = await uploadToCloudinary(req.files.cancelCheque[0].buffer,req.files.cancelCheque[0].mimetype, "b2b");
    //   data.cancelChequeImage = cloudinaryRes.secure_url;
    // }
    if (
      req.files &&
      req.files?.cancelCheque &&
      req.files?.cancelCheque?.length > 0
    ) {
      const fullPath = req.files.cancelCheque[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      let relativePath =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath.replace(/\\/g, "/");

      // ✅ ensure leading slash
      data.cancelChequeImage = relativePath.startsWith("/")
        ? relativePath
        : `/${relativePath}`;
    }

    const result = await b2bAdminServices.update(id, data, userId, userName);

    res.status(200).json({
      status: true,
      message: "B2B Admin updated successfully",
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

const getAllB2BAdmins = async (req, res) => {
  try {
    const {
      page,
      limit,
      search = "",
      status = "",
      country = "",
      subscription = "",
    } = req.query;
    const result = await b2bAdminServices.getAll(
      page,
      limit,
      search,
      status,
      country,
      subscription
    );
    res.status(200).json({
      status: true,
      message: "B2B Admins fetched successfully",
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

const b2bCountry = async (req, res) => {
  try {
    const result = await b2bAdminServices.b2bCountry();
    res.status(200).json({
      status: true,
      message: "B2B Admin fetched successfully",
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

const getB2BAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await b2bAdminServices.getById(id);
    res.status(200).json({
      status: true,
      message: "B2B Admin fetched successfully",
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

const deleteB2BAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await b2bAdminServices.delete(id);
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

const bulkAddB2BAdmins = async (req, res) => {
  try {
    const filePath = req.files?.excelFile?.[0]?.path;
    if (!filePath) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    const currentUser = req.user;

    const formattedB2BAdmins = [];

    for (const row of rows) {
      let hashedPassword = null;
      if (row.password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(row.password, saltRounds);
      }
      // Build admin object
      formattedB2BAdmins.push({
        companyName: row.companyName || "",
        contactPerson: row.contactPerson || "",
        phone: row.phone || "",
        email: row.email || "",
        password: hashedPassword || "",
        country: row.country || "",
        state: row.state || "",
        city: row.city || "",
        commissionPercentage: row.commissionPercentage || null,
        memberLimit: row.memberLimit || 5,
        status: row.status || "Active",
        websiteUrl: row.websiteUrl || "",
        agreementStartDate: row.agreementStartDate || "",
        agreementEndDate: row.agreementEndDate || "",
        GST_VAT: row.GST_VAT || "",
        bankName: row.bankName || "",
        branch: row.branch || "",
        accountNumber: row.accountNumber || "",
        ifscCode: row.ifscCode || "",
        created_by: currentUser?.userId || null,
        createdByName: currentUser?.userName || "",
      });
    }

    const insertedAdmins = await b2bAdminServices.bulkAddB2BAdmins(
      formattedB2BAdmins
    );

    fs.unlinkSync(filePath);

    return res.status(200).json({
      status: true,
      message: `${insertedAdmins.length} B2B Admins uploaded successfully`,
      data: insertedAdmins,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const downloadB2bAdmin = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      country = "",
      subscription = "",
    } = req.query;

    const result = await b2bAdminServices.downloadB2bAdmin(
      search,
      status,
      country,
      subscription
    );

    if (!result.success) {
      return res.status(404).json({
        status: false,
        message: result.message,
      });
    }

    const fileName = path.basename(result.filePath);
    const fileUrl = `/public/${fileName}`;

    res.status(200).json({
      status: true,
      fileUrl,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createB2bAdmin,
  updateB2BAdmin,
  getAllB2BAdmins,
  b2bCountry,
  getB2BAdminById,
  deleteB2BAdmin,
  bulkAddB2BAdmins,
  downloadB2bAdmin,
};
