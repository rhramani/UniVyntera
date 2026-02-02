const TaskCategory = require("../../../model/taskManagement/taskCategory");

const paginate = require("../../../utils/pagination");

const taskCategorySerices = {
    create: async (data, userId, userName) => {
        const { name } = data;

        const checkExist = await TaskCategory.findOne({ name });
        if(checkExist) {
            throw { status: false,  message: "Task category already exist" };
        }

        const newData = await TaskCategory.create({
            name,
             created_by: userId,
            createdByName: userName,
        });

        return newData;
    },
    update: async (id, updateData, userId, userName) => {
            const { name } = updateData;
    
            const checkExist = await TaskCategory.findById(id);
            if (!checkExist) {
                throw { status: false, message: "Task category not found" };
            }
    
            const trimmedName = name?.trim();
    
            if (trimmedName && trimmedName !== checkExist.name) {
                const query = {
                    name: trimmedName,
                    _id: { $ne: id }
                };
    
                const duplicate = await TaskCategory.findOne(query);
                if (duplicate) {
                    throw { status: false, message: "Task category already exists" };
                }
            }
    
            const updatedData = await TaskCategory.findByIdAndUpdate(
                id,
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
    
            const searchOptions = { searchText, searchFields: ["name"] };
            const getAll = await paginate(
                TaskCategory,
                {},
                page,
                limit,
                { createdAt: -1 },
                [],
                searchOptions
            );
    
            if (!getAll) {
                return { status: false, message: "No task category found" };
            }
    
            return getAll;
        },
    
        deleteCategory: async (id) => {
            const expenseType = await TaskCategory.findByIdAndDelete(id);
    
            if (!expenseType) {
                throw { status: false, message: "Task category not found" };
            }
    
            return "Task category deleted successfully";
        },
}

module.exports = taskCategorySerices;