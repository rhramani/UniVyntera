const StudentInvoice = require("../../model/studentInvoice");
const paginate = require("../../utils/pagination");
const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

const User = require("../../model/user");

const studentInvoiceServices = {
  create: async (data, userId, userName) => {
    const { invoiceNo, invoiceDate, b2b, studentDetails } = data;
    const created_by = userId;
    const createdByName = userName;
    const invoicesToInsert = studentDetails.map((entry) => ({
      invoiceNo,
      invoiceDate,
      b2b,
      student: entry.student,
      amount: entry.amount,
      currencyCode: entry.currencyCode,
      rate: entry.rate,
      payable: entry.payable,
      paymentMode: entry.paymentMode,
      bank: entry.bank,
      created_by,
      createdByName,
    }));

    const createdInvoices = await StudentInvoice.insertMany(invoicesToInsert);
    return createdInvoices;
  },
  update: async (invoiceId, updateData, userId, userName) => {
    const existingInvoice = await StudentInvoice.findById(invoiceId);
    if (!existingInvoice) {
      throw { status: false, message: "Student invoice not found" };
    }

    if (updateData.invoiceNo) {
      const duplicate = await StudentInvoice.findOne({
        _id: { $ne: invoiceId },
        invoiceNo: updateData.invoiceNo,
        student: { $ne: existingInvoice.student },
      });

      if (duplicate) {
        throw {
          status: false,
          message: `Invoice No ${updateData.invoiceNo} is already assigned to another student`,
        };
      }
    }

    const updatedInvoice = await StudentInvoice.findByIdAndUpdate(
      invoiceId,
      {
        ...updateData,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return updatedInvoice;
  },
  getAll: async (
    currentUser,
    page,
    limit,
    searchText = "",
    b2bId,
    startDate,
    endDate,
    status
  ) => {
    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    const populateFields = [
      { path: "student", select: "name email studentId" },
      { path: "b2b", select: "companyName" },
      { path: "created_by", select: "name" },
    ];
    const searchOptions = {
      searchText,
      searchFields: ["name", "studentId"],
    };
    const filter = {};

    if (roleName === "Branch"){
      const branchUsers = await User.find({
        branchId: currentUser.userId
      }).select("_id");
      const userIdsUnderBranch = branchUsers.map((u) => u._id.toString());
      filter["created_by"] = {
        $in: [currentUser.userId, ...userIdsUnderBranch]
      }
    }
    else if(roleName !== "Super Admin") {
      // Only fetch documents created by this user
      filter.created_by = currentUser.userId;
    }
    if (b2bId) {
      filter.b2b = b2bId;
    }

    if (startDate || endDate) {
      filter.invoiceDate = {};
      if (startDate) {
        filter.invoiceDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.invoiceDate.$lte = end;
      }
    }
    if (searchText && searchText.trim() !== "") {
      const regex = new RegExp(searchText.trim(), "i");
      filter.$or = [
        { name: regex },
        { studentId: regex },
      ];
    }

    if(status && ["paid" , "unpaid"].includes(status.toLowerCase())){
      filter.status = status.toLowerCase();
    }
    const data = await paginate(
      StudentInvoice,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      {}
    );

    return data;
  },
  delete: async (id) => {
    const deleted = await StudentInvoice.findByIdAndDelete(id);
    if (!deleted)
      throw {
        status: false,
        message: "StudentInvoice not found or already deleted",
      };
    return "StudentInvoice deleted successfully";
  },
  exportDataToExcel: async (ids) => {
    const dataList = await StudentInvoice.find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate([
        { path: "b2b", select: "companyName" },
        { path: "student", select: "name" }
      ]);

    if (!dataList.length) {
      throw { success: false, message: "No Student Invoice found." };
    }

    const downloadsDir = path.join(__dirname, "../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "applicationFeeInvoice.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "invoiceNo", title: "Invoice No" },
        { id: "invoiceDate", title: "Invoice Date" },
        { id: "b2bCompany", title: "B2B Company" },
        { id: "studentName", title: "Student Name" },
        { id: "amount", title: "Amount" },
        { id: "currencyCode", title: "Currency Code" },
        { id: "rate", title: "Rate" },
        { id: "payable", title: "Payable" }
      ]
    });

    const records = dataList.map((item) => ({
      invoiceNo: item.invoiceNo || "",
      invoiceDate: item.invoiceDate?.toISOString().split("T")[0] || "",
      b2bCompany: item.b2b?.companyName || "N/A",
      studentName: item.student?.name || "N/A",
      amount: item.amount || "",
      currencyCode: item.currencyCode || "",
      rate: item.rate || "",
      payable: item.payable || ""
    }));

    await csvWriter.writeRecords(records);

    return {
      success: true,
      filePath
    };
  }
};

module.exports = studentInvoiceServices;
