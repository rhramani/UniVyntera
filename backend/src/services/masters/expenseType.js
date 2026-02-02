const ExpenseType = require("../../../model/masters/expenseType");
// const User = require("../../../model/user");
// const B2BMember = require("../../../model/masters/b2b/b2bMember");
const paginate = require("../../../utils/pagination");

const rolesServices = {
    create: async (data, userId, userName) => {
        const { name } = data;

        const checkExist = await ExpenseType.findOne({ name: name });
        if (checkExist) {
            throw { status: false, message: "Expense type already exist" };
        }

        const newExpenseType = await ExpenseType.create({
            name,
            created_by: userId,                     
            createdByName: userName,
        });

        return newExpenseType;
    },

    update: async (expenseTypeId, updateData, userId, userName) => {
        const { name } = updateData;

        const checkExist = await ExpenseType.findById(expenseTypeId);
        if (!checkExist) {
            throw { status: false, message: "Expense type not found" };
        }

        const trimmedName = name?.trim();

        if (trimmedName && trimmedName !== checkExist.name) {
            const query = {
                name: trimmedName,
                _id: { $ne: expenseTypeId }
            };

            const duplicate = await ExpenseType.findOne(query);
            if (duplicate) {
                throw { status: false, message: "Expense type already exists" };
            }
        }

        const updatedData = await ExpenseType.findByIdAndUpdate(
            expenseTypeId,
            {
                ...updateData,
                updated_by: userId,
                updatedByName: userName
            },
            { new: true }
        );

        return updatedData;
    },

    getAll: async (page, limit, searchText = "") => {

        // const query = {};


        // if (String(showAll) !== "true") {
        //     if (branchId) {
        //         query.branchId = branchId;
        //     } else {
        //         query.branchId = { $in: [null, undefined] };
        //     }
        // }


        const searchOptions = { searchText, searchFields: ["name"] };
        const getAll = await paginate(
            ExpenseType,
            {},
            page,
            limit,
            { createdAt: -1 },
            [],
            searchOptions
        );

        if (!getAll) {
            return { status: false, message: "No expense type found" };
        }

        return getAll;
    },

    deleteExpenseType: async (expenseTypeId) => {
        const expenseType = await ExpenseType.findByIdAndDelete(expenseTypeId);

        if (!expenseType) {
            throw { status: false, message: "Expense type not found" };
        }

        return "Expense type deleted successfully";
    },
};

module.exports = rolesServices;
