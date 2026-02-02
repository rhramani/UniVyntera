const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const mongoose = require("mongoose");

const User = require("../../model/user");
const GenerateInvoice = require("../../model/generateInvoice");
const SubPlan = require("../../model/masters/generateInvoice/subPlan");
const Lead = require("../../model/lead");
const StudentApplication = require("../../model/masters/studentApplication/studentApplication");
const VisitorApplication = require("../../model/visitorApplication/visitorApplication");
const Expense = require("../../model/accountExpense");
const Bank = require("../../model/masters/banking");
const FundTransfer = require("../../model/fundTransfer");

const Paginate = require("../../utils/pagination");

const generateInvoiceServices = {
  create: async (data, userId, userName) => {
    const { subPlan, discount } = data;
    if (data.paidAmount && Array.isArray(data.paidAmount)) {
      data.paidAmount = data.paidAmount.map((entry) => ({
        amount: entry.amount,
         date: entry.date ? new Date(entry.date) : new Date(),
        bank: entry.bank || null,
        paymentMode: entry.paymentMode || null, // ✅ keep mode per entry
      }));
    }

    const subPlanDoc = await SubPlan.findById(subPlan);
    // if (!subPlanDoc) {
    //   throw new Error("SubPlan not found");
    // }

    // const allowedDiscount = parseFloat(subPlanDoc.maxDiscount || "0");
    // const enteredDiscount = parseFloat(discount || "0");

    // if (enteredDiscount > allowedDiscount) {
    //   throw {
    //     status: false,
    //     message: `Discount exceeds allowed maximum for this subplan: ${allowedDiscount}`,
    //   };
    // }

    const invoice = await GenerateInvoice.create({
      ...data,
      created_by: userId,
      createdByName: userName,
    });
    return invoice;
  },
  update: async (updateId, updateData, userId, userName) => {
    const existing = await GenerateInvoice.findById(updateId);
    if (!existing) {
      throw { status: false, message: "Invoice not found" };
    }

    const subPlanId = updateData.subPlan || existing.subPlan;
    const discount = updateData.discount ?? existing.discount;

    const subPlanDoc = await SubPlan.findById(subPlanId);
    if (!subPlanDoc) {
      throw { status: false, message: "SubPlan not found" };
    }

    // const allowedDiscount = parseFloat(subPlanDoc.maxDiscount || "0");
    // const enteredDiscount = parseFloat(discount || "0");

    // if (enteredDiscount > allowedDiscount) {
    //   throw {
    //     status: false,
    //     message: `Discount exceeds allowed maximum for this subplan: ${allowedDiscount}`,
    //   };
    // }

    //  Handle paidAmount
    if (
      Array.isArray(updateData.paidAmount) &&
      updateData.paidAmount.length > 0
    ) {
      const paid = updateData.paidAmount[0]; // assuming one at a time
      const existingPaid = [...(existing.paidAmount || [])];

      if (updateData.paidAmountId) {
        // 🔁 Update existing entry by ID
        const index = existingPaid.findIndex(
          (entry) => entry._id.toString() === updateData.paidAmountId
        );
        if (index !== -1) {
          existingPaid[index].amount = paid.amount;
          existingPaid[index].date =  paid.date ? new Date(paid.date) : new Date(),
          existingPaid[index].bank = paid.bank || null;
          existingPaid[index].paymentMode =
            paid.paymentMode || existingPaid[index].paymentMode || null; // ✅ update mode too
        } else {
          throw { status: false, message: "PaidAmount ID not found." };
        }
      } else {
        // Add new entry
        existingPaid.push({
          amount: paid.amount,
          date: paid.date ? new Date(paid.date) : new Date(),
          bank: paid.bank || null,
          paymentMode: paid.paymentMode || null, // ✅ new field
        });
      }

      updateData.paidAmount = existingPaid;
    } else {
      delete updateData.paidAmount; // avoid accidentally clearing it
    }

    const updated = await GenerateInvoice.findByIdAndUpdate(
      updateId,
      {
        ...updateData,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return updated;
  },

  getAll: async (
    page,
    limit,
    searchText = "",
    paymentType,
    mainPlan,
    subPlan,
    startDate,
    endDate,
    status,
    branchId,
    showAll,
    currentUser
  ) => {
    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    const userId = currentUser.userId;
    let filter = {};

    if (paymentType) filter.paymentType = paymentType;
    if (mainPlan) filter.mainPlan = mainPlan;
    if (subPlan) filter.subPlan = subPlan;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchUsers = await User.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((u) => u._id.toString());

      filter.created_by = { $in: [branchId, ...branchUserIds] };
    } else if (String(showAll) === "true") {
      // No additional filter
    } else {
      const headOfficeUsers = await User.find({
        $or: [{ branchId: null }, { branchId: { $exists: false } }],
      }).select("_id");

      const headOfficeUserIds = headOfficeUsers.map((u) => u._id.toString());

      filter.created_by = { $in: headOfficeUserIds };
    }
    if (roleName === "Branch") {
      const branchMembers = await User.find({ branchId: userId }).select("_id");
      const branchMembersIds = branchMembers.map((m) => m._id.toString());
      filter.created_by = { $in: [userId, ...branchMembersIds] };
    } else if (roleName === "Branch Member") {
      filter.created_by = userId;
    }

    let matchedIds = [];

    if (searchText) {
      const matchedLeads = await Lead.find(
        { name: { $regex: searchText, $options: "i" } },
        { _id: 1 }
      ).lean();

      const matchedStudents = await StudentApplication.find(
        { name: { $regex: searchText, $options: "i" } },
        { _id: 1 }
      ).lean();

      const matchedVisitors = await VisitorApplication.find(
        { name: { $regex: searchText, $options: "i" } },
        { _id: 1 }
      ).lean();

      matchedIds = [
        ...matchedLeads.map((l) => l._id.toString()),
        ...matchedStudents.map((s) => s._id.toString()),
        ...matchedVisitors.map((v) => v._id.toString()),
      ];

      if (matchedIds.length) {
        filter.name = { $in: matchedIds };
      } else {
        return {
          totalRecords: 0,
          currentPage: parseInt(page),
          totalPages: 0,
          pageSize: parseInt(limit),
          data: [],
        };
      }
    }

    const populateFields = [
      { path: "mainPlan", select: "name" },
      { path: "subPlan", select: "name" },
    ];

    let result = await Paginate(
      GenerateInvoice,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields
    );

    // Manually filter by dueAmount status in JS
    if (status && status !== "all") {
      result.data = result.data.filter((inv) => {
        const dueAmount = parseFloat(inv.dueAmount || "0");
        return status === "paid"
          ? dueAmount <= 0
          : status === "due"
          ? dueAmount > 0
          : true;
      });

      result.totalRecords = result.data.length;
      result.totalPages = 1; // As data is already paginated
    }

    const nameIds = result.data.map((inv) => inv.name).filter(Boolean);

    const leads = await Lead.find(
      { _id: { $in: nameIds } },
      { _id: 1, name: 1 }
    ).lean();

    const students = await StudentApplication.find(
      { _id: { $in: nameIds } },
      { _id: 1, name: 1 }
    ).lean();

    const visitors = await VisitorApplication.find(
      { _id: { $in: nameIds } },
      { _id: 1, name: 1 }
    ).lean();

    const nameMap = new Map();
    leads.forEach((l) => nameMap.set(l._id.toString(), l.name));
    students.forEach((s) => nameMap.set(s._id.toString(), s.name));
    visitors.forEach((v) => nameMap.set(v._id.toString(), v.name));

    result.data = result.data.map((inv) => {
      const nameId = inv.name?.toString();
      const actualName = nameMap.get(nameId) || null;
      return { ...inv, name: actualName };
    });

    return result;
  },

  delete: async (id) => {
    const deleted = await GenerateInvoice.findByIdAndDelete(id);
    if (!deleted)
      throw { status: false, message: "Invoice not found or already deleted" };
    return "Invoice deleted successfully";
  },
  getNamesFromLeadAndStudents: async (currentUser) => {
    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    const userId = currentUser.userId;
    let filter = {};

    if (roleName === "Branch") {
      const branchMembers = await User.find({ branchId: userId }).select("_id");
      const branchMemberIds = branchMembers.map((m) => m._id.toString());

      filter.created_by = { $in: [userId, ...branchMemberIds] };
    } else if (roleName === "Branch Member") {
      filter.created_by = userId;
    } else {
      // Super Admin / HO → no filter
    }

    // Fetch with createdAt also
    const leadNames = await Lead.find(filter, { name: 1, createdAt: 1 }).lean();
    const studentNames = await StudentApplication.find(filter, {
      name: 1,
      createdAt: 1,
    }).lean();
    const visitorNames = await VisitorApplication.find(filter, {
      name: 1,
      createdAt: 1,
    }).lean();

    const combined = [
      ...leadNames.map((l) => ({
        _id: l._id,
        name: l.name,
        createdAt: l.createdAt,
      })),
      ...studentNames.map((s) => ({
        _id: s._id,
        name: s.name,
        createdAt: s.createdAt,
      })),
      ...visitorNames.map((v) => ({
        _id: v._id,
        name: v.name,
        createdAt: v.createdAt,
      })),
    ];

    // Map to track latest by name
    const latestByName = new Map();

    for (const item of combined) {
      const key = item.name?.trim();
      if (!key) continue;

      if (!latestByName.has(key)) {
        latestByName.set(key, item);
      } else {
        // Replace only if current one is newer
        const existing = latestByName.get(key);
        if (new Date(item.createdAt) > new Date(existing.createdAt)) {
          latestByName.set(key, item);
        }
      }
    }

    // Final result
    return Array.from(latestByName.values());
  },
  exportDataToExcel: async (ids) => {
    // Fetch invoices with optional user info
    const dataList = await GenerateInvoice.find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate([
        { path: "created_by", select: "name" },
        { path: "updated_by", select: "name" },
        { path: "mainPlan", select: "name" },
        { path: "subPlan", select: "name" },
      ]);

    if (!dataList.length) {
      throw { success: false, message: "No GenerateInvoice records found." };
    }

    const downloadsDir = path.join(__dirname, "../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "generateInvoiceReport.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "name", title: "Name" },
        { id: "contactNo", title: "Contact No" },
        { id: "mainPlan", title: "Main Plan" },
        { id: "subPlan", title: "Sub Plan" },
        { id: "amount", title: "Amount" },
        { id: "discount", title: "Discount" },
        { id: "discountAmount", title: "Discount Amount" },
        { id: "payableAmount", title: "Payable Amount" },
        { id: "dueAmount", title: "Due Amount" },
        { id: "paymentType", title: "Payment Type" },
        { id: "paymentMode", title: "Payment Mode" },
      ],
    });

    const records = dataList.map((item) => ({
      name: item.name || "",
      contactNo: item.contactNo || "",
      mainPlan: item.mainPlan?.name || "N/A",
      subPlan: item.subPlan?.name || "N/A",
      amount: item.amount || "",
      discount: item.discount || "",
      discountAmount: item.discountAmount || "",
      payableAmount: item.payableAmount || "",
      dueAmount: item.dueAmount || "",
      paymentType: item.paymentType || "",
      paymentMode: item.paymentMode || "",
    }));

    await csvWriter.writeRecords(records);

    return {
      success: true,
      filePath,
    };
  },

  getInvoiceWithTotals: async (studentId, mainPlanId) => {
    if (!studentId) {
      throw { status: false, message: "Student id is required" };
    }
    if (!mainPlanId) {
      throw { status: false, message: "Main Plan id is required" };
    }

    // Fetch invoices matching student + plan
    const invoices = await GenerateInvoice.find({
      name: studentId,
      mainPlan: mainPlanId,
    })
      .populate("mainPlan", "name")
      .populate("subPlan", "name")
      .populate("paidAmount.bank", "bankName")
      .sort({ createdAt: -1 })
      .lean();

    if (!invoices.length) {
      return {
        data: [],
        totals: { totalCash: 0, totalBank: 0, grandTotal: 0 },
      };
    }

    // Resolve actual name (Lead, Student, Visitor)
    let actualName = null;

    const lead = await Lead.findById(studentId, {
      name: 1,
      createdAt: 1,
    }).lean();
    const student = await StudentApplication.findById(studentId, {
      name: 1,
      createdAt: 1,
    }).lean();
    const visitor = await VisitorApplication.findById(studentId, {
      name: 1,
      createdAt: 1,
    }).lean();

    const candidates = [lead, student, visitor].filter(Boolean);
    if (candidates.length) {
      candidates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      actualName = candidates[0].name;
    }

    // Calculate totals
    let totalCash = 0;
    let totalBank = 0;

    invoices.forEach((inv) => {
      if (Array.isArray(inv.paidAmount)) {
        inv.paidAmount.forEach((p) => {
          const amt = Number(p.amount) || 0;
          const mode = (p.paymentMode || "").toLowerCase();

          if (["gpay", "upi", "bank", "netbanking"].includes(mode)) {
            totalBank += amt;
          } else if (mode === "cash") {
            totalCash += amt;
          }
        });
      }
    });

    // Return result
    return {
      data: invoices.map((inv) => ({
        ...inv,
        name: actualName, // Replace ObjectId with resolved name
        studentId: studentId,
         discount: inv.discount || "",
      discountAmount: inv.discountAmount || "0",
      })),
      totals: {
        totalCash,
        totalBank,
        grandTotal: totalCash + totalBank,
      },
    };
  },
  getInvoiceHistory: async (studentId, mainPlanId, subPlanId) => {
    if (!studentId) throw { status: false, message: "Student id is required" };
    if (!mainPlanId)
      throw { status: false, message: "Main Plan id is required" };

    const query = { name: studentId, mainPlan: mainPlanId };
    if (subPlanId) {
      query.subPlan = subPlanId;
    }

    const invoices = await GenerateInvoice.find(query)
      .populate("mainPlan", "name")
      .populate("subPlan", "name")
      .sort({ createdAt: 1 })
      .lean();

    if (!invoices.length) {
      return {
        invoices: [],
        totals: {
          planTotal: 0,
          totalPaid: 0,
          totalDue: 0,
          totalCash: 0,
          totalBank: 0,
          grandTotal: 0, // == totalPaid
        },
      };
    }

    const toNumber = (v) => {
      if (v === null || v === undefined) return 0;
      const n = Number(String(v).replace(/[, ]/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    let planTotal = 0;
    let totalPaid = 0;
    let totalCash = 0;
    let totalBank = 0;

    const normalizeMode = (mode) => {
      if (!mode) return "cash";
      const m = mode.toLowerCase();
      if (["bank", "gpay", "upi", "netbanking"].includes(m)) return "bank";
      if (m === "cash") return "cash";
      return "cash";
    };

    for (const inv of invoices) {
      const invCap = toNumber(inv.payableAmount ?? inv.amount);
      if (invCap > planTotal) planTotal = invCap;

      if (Array.isArray(inv.paidAmount)) {
        for (const p of inv.paidAmount) {
          const amt = toNumber(p.amount);
          totalPaid += amt;

          const modeCategory = normalizeMode(p.paymentMode);
          if (modeCategory === "bank") totalBank += amt;
          else totalCash += amt;
        }
      }
    }

    const totalDue = Math.max(planTotal - totalPaid, 0);

    return {
      invoices,
      totals: {
        planTotal,
        totalPaid,
        totalDue,
        totalCash,
        totalBank,
        grandTotal: totalPaid,
      },
    };
  },
  getFinancialSummary: async (startDate, endDate, branchId) => {
    const dateFilter = {};

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (branchId) {
      dateFilter.branch = branchId;
    }

    const [paymentInvoices, universityCommissions, b2bCommissions, expenses] = 
      await Promise.all([
        GenerateInvoice.aggregate([
          { $unwind: "$paidAmount" },
          {
            $match: {
              "paidAmount.paymentMode": { $in: ["Bank", "GPay", "UPI"] },
            },
          },
          {
            $group: {
              _id: "$paidAmount.bank", // Bank ID
              totalAmount: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $eq: ["$paidAmount.amount", ""] },
                        { $eq: ["$paidAmount.amount", null] },
                      ],
                    },
                    0,
                    { $toDouble: "$paidAmount.amount" },
                  ],
                },
              },
            },
          },
        ]),

        StudentApplication.aggregate([
          {
            $match: {
              "universityPaymentReceived.status": true,
              "universityPaymentReceived.paymentMode": {
                $in: ["Bank", "GPay", "UPI"],
              },
              ...dateFilter,
            },
          },
          {
            $group: {
              _id: "$universityPaymentReceived.bank",
              totalAmount: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $eq: ["$universityPaymentReceived.amount", ""] },
                        { $eq: ["$universityPaymentReceived.amount", null] },
                      ],
                    },
                    0,
                    { $toDouble: "$universityPaymentReceived.amount" },
                  ],
                },
              },
            },
          },
        ]),

        StudentApplication.aggregate([
          {
            $match: {
              "universityPaymentReceived.b2bCommission.paymentProcess": "Paid",
              "universityPaymentReceived.b2bCommission.paymentMethod": {
                $in: ["Bank", "GPay", "UPI"],
              },
              ...dateFilter,
            },
          },
          {
            $group: {
              _id: "$universityPaymentReceived.b2bCommission.bank",
              totalAmount: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        {
                          $eq: [
                            "$universityPaymentReceived.b2bCommission.commissionAmount",
                            "",
                          ],
                        },
                        {
                          $eq: [
                            "$universityPaymentReceived.b2bCommission.commissionAmount",
                            null,
                          ],
                        },
                      ],
                    },
                    0,
                    {
                      $toDouble:
                        "$universityPaymentReceived.b2bCommission.commissionAmount",
                    },
                  ],
                },
              },
            },
          },
        ]),

        Expense.aggregate([
          {
            $match: {
              paymentMethod: { $in: ["Bank", "GPay", "UPI"] },
              ...dateFilter,
            },
          },
          {
            $group: {
              _id: "$bank", // Bank ID
              totalAmount: { $sum: "$amount" },
            },
          },
        ]),
      ]);

    const populatedPaymentInvoices = await Bank.populate(paymentInvoices, {
      path: "_id",
      select: "bankName",
    });

    const populatedUniversityCommissions = await Bank.populate(
      universityCommissions,
      { path: "_id", select: "bankName" }
    );

    const populatedB2BCommissions = await Bank.populate(b2bCommissions, {
      path: "_id",
      select: "bankName",
    });

    const populatedExpenses = await Bank.populate(expenses, {
      path: "_id",
      select: "bankName",
    });

    const bankWiseTotalMap = {};

    const addToBankwiseTotals = (arr, sign = 1) => {
      arr.forEach((item) => {
        const bankId = item._id?._id;
        const bankName = item._id?.bankName;
        const amount = item.totalAmount * sign;

        if (!bankWiseTotalMap[bankId]) {
          bankWiseTotalMap[bankId] = {
            bankId,
            bankName,
            totalAmount: 0,
          };
        }
        bankWiseTotalMap[bankId].totalAmount += amount;
      });
    };
    addToBankwiseTotals(populatedPaymentInvoices, +1);
    addToBankwiseTotals(populatedUniversityCommissions, +1);
    addToBankwiseTotals(populatedB2BCommissions, -1);
    addToBankwiseTotals(populatedExpenses, -1);

    const bankwiseTotals = Object.values(bankWiseTotalMap);

    const totalBank = bankwiseTotals.reduce((sum, b) => sum + b.totalAmount, 0);

    const bankBalance = totalBank;
    const cashExpenses = await Expense.aggregate([
      { $match: { paymentMethod: "Cash", ...dateFilter } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const cashUniversityCommissions = await StudentApplication.aggregate([
      {
        $match: {
          "universityPaymentReceived.status": true,
          "universityPaymentReceived.paymentMode": "Cash",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$universityPaymentReceived.amount", ""] },
                    { $eq: ["$universityPaymentReceived.amount", null] },
                  ],
                },
                0,
                { $toDouble: "$universityPaymentReceived.amount" },
              ],
            },
          },
        },
      },
    ]);

    const cashPaymentInvoices = await GenerateInvoice.aggregate([
      { $unwind: "$paidAmount" },
      {
        $match: {
          "paidAmount.paymentMode": "Cash",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$paidAmount.amount", ""] },
                    { $eq: ["$paidAmount.amount", null] },
                  ],
                },
                0,
                { $toDouble: "$paidAmount.amount" },
              ],
            },
          },
        },
      },
    ]);

    const cashB2BCommissions = await StudentApplication.aggregate([
      {
        $match: {
          "universityPaymentReceived.b2bCommission.paymentProcess": "Paid",
          "universityPaymentReceived.b2bCommission.paymentMethod": "Cash",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $cond: [
                {
                  $or: [
                    {
                      $eq: [
                        "$universityPaymentReceived.b2bCommission.commissionAmount",
                        "",
                      ],
                    },
                    {
                      $eq: [
                        "$universityPaymentReceived.b2bCommission.commissionAmount",
                        null,
                      ],
                    },
                  ],
                },
                0,
                {
                  $toDouble:
                    "$universityPaymentReceived.b2bCommission.commissionAmount",
                },
              ],
            },
          },
        },
      },
    ]);

    const cashBalance =
      (cashPaymentInvoices[0]?.totalAmount || 0) +
      (cashUniversityCommissions[0]?.totalAmount || 0) -
      (cashB2BCommissions[0]?.totalAmount || 0) -
      (cashExpenses[0]?.totalAmount || 0);

    const transferFilter = {};
    if(startDate && endDate){
      transferFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if(branchId) {
      transferFilter.branch = branchId;
    }

    const transfers = await FundTransfer.find(transferFilter).populate("bank" , "bankName");

let totalCashToBank = 0;
let totalBankToCash = 0;

transfers.forEach((t) => {
  if (t.fromType  === "CashToBank") totalCashToBank += t.amount;
  else if (t.fromType  === "BankToCash") totalBankToCash += t.amount;
});

const adjustedCashBalance = cashBalance - totalCashToBank + totalBankToCash;
const adjustedBankBalance = bankBalance + totalCashToBank - totalBankToCash;

transfers.forEach((t) => {
  const bankId = t.bank?._id?.toString();
  const bankName = t.bank?.bankName;
  if (!bankId) return;

  if (!bankWiseTotalMap[bankId]) {
    bankWiseTotalMap[bankId] = { bankId, bankName, totalAmount: 0 };
  }

  if (t.fromType  === "CashToBank") {
    bankWiseTotalMap[bankId].totalAmount += t.amount;
  } else if (t.fromType  === "BankToCash") {
    bankWiseTotalMap[bankId].totalAmount -= t.amount;
  }
});


const updatedBankwiseTotals = Object.values(bankWiseTotalMap);
const totalBankAfterTransfer = updatedBankwiseTotals.reduce(
  (sum, b) => sum + b.totalAmount,
  0
);
   return {
  bankBalance: adjustedBankBalance,
  cashBalance: adjustedCashBalance,
  totalBank: totalBankAfterTransfer,
  bankwiseTotals: updatedBankwiseTotals,
};

  },
};

module.exports = generateInvoiceServices;
