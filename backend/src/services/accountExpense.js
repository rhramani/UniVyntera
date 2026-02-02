const AccountExpense = require("../../model/accountExpense");
const Branch = require("../../model/branch/branches");
const User = require("../../model/user"); 
const paginate = require("../../utils/pagination");
const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const mongoose = require("mongoose");

const accountExpenseServices = {
  create: async (data) => {
    const { bank } = data;
    if (bank === "null" || bank === "" || bank === undefined) {
      data.bank = null;
    }
    return await AccountExpense.create(data);
  },
  update: async (updateId, updateData) => {
    return await AccountExpense.findByIdAndUpdate(updateId, updateData, {
      new: true,
    });
  },
  getAll: async (
    page,
    limit,
    searchText = "",
    startDate,
    endDate,
    center,
    expenseType,
    currentUser
  ) => {
    const searchOptions = {
      searchText,
      searchFields: ["center", "mode"],
    };
    const populateFields = [{ path: "type", select: "name" }];

    const filter = {};

    // 👇 Apply date range filter on `date` field
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }
    if (center && center !== "All") {
      filter.center = center;
    }

    if (expenseType) {
      filter.type = expenseType;
    }

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === "Branch" && currentUser.userId) {
      const branchUsers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");
      const userIdsUnderBranch = branchUsers.map((u) => u._id.toString());
      filter["created_by"] = {
        $in: [currentUser.userId, ...userIdsUnderBranch],
      };
    }


    const result = await paginate(
      AccountExpense,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    return result;
  },
  delete: async (deleteId) => {
    const expense = await AccountExpense.findById(deleteId);
    if (!expense) {
      throw { status: false, message: "Expense not found" };
    }

    await AccountExpense.findByIdAndDelete(deleteId);
    return "Expense deleted successfully";
  },
  exportDataToExcel: async (ids) => {
    const dataList = await AccountExpense.find({ _id: { $in: ids } })
      .sort({ date: -1 })
      .populate([
        { path: "type", select: "name" },
        { path: "created_by", select: "name" },
        { path: "updated_by", select: "name" },
      ]);

    if (!dataList.length) {
      throw { success: false, message: "No Account Expense records found." };
    }

    const downloadsDir = path.join(__dirname, "../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "accountExpensesReport.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "center", title: "Center" },
        { id: "type", title: "Expense Type" },
        { id: "mode", title: "Payment Mode" },
        { id: "amount", title: "Amount" },
        { id: "date", title: "Date" },
        { id: "proof", title: "Proof (File Path)" },
        { id: "remarks", title: "Remarks" },
        { id: "createdBy", title: "Created By" },
        { id: "updatedBy", title: "Updated By" },
      ],
    });

    const records = dataList.map((item) => ({
      center: item.center || "",
      type: item.type?.name || "N/A",
      mode: item.mode || "",
      amount: item.amount || "",
      date: item.date ? item.date.toISOString().split("T")[0] : "",
      proof: item.proof || "",
      remarks: item.remarks || "",
      createdBy: item.created_by?.name || item.createdByName || "N/A",
      updatedBy: item.updated_by?.name || item.updatedByName || "N/A",
    }));

    await csvWriter.writeRecords(records);

    return {
      success: true,
      filePath,
    };
  },
};

module.exports = accountExpenseServices;
