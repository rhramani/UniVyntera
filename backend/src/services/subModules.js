const SubModule = require("../../model/subModules");
// const Module = require("../../model/modules");

const subModuleServices = {
    createSubModule : async (data) => {
        const { name , parentModule, fields } = data;
        
        const checkName = await SubModule.findOne({name});
        if(checkName){
            return { status: false , message: "SubModule already exist"}
        }


        const checkParentModule = await Module.findById(parentModule);
        if(!checkParentModule){
            return { status: false, message: "Parent module doesn't exist"}
        }

        const newSubModule = await SubModule.create({
            name,
            parentModule,
            fields
        })

        return newSubModule;
    },
    updateSubModule : async (subModuleId, updateFields) => {
        const updateData = {};

        for(const key in updateFields) {
            updateData[`fields.${key}`] = updateFields[key];
        }

        const result = await SubModule.findByIdAndUpdate(
            subModuleId,
            { $set: updateData},
            {new: true}
        )

        return result;
    },
    getSubModuleById : async (subModuleId) => {
        const getSubModule = await SubModule.findById(subModuleId);
        
        if(!getSubModule){
            return { status: false, message: "Sub module doesn't found"}
        }

        return getSubModule;
    },
    getAllSubModules : async () => {
        const getAllModules = await SubModule.find();

        if(!getAllModules){
            return { status: false, message : "No submodules found"}
        }

        return getAllModules;
    },
    deleteSubModuleById : async (subModuleId) => {
        const checkSubModule = await SubModule.findByIdAndDelete(subModuleId);

        if(!checkSubModule){
            return { status: false , message : "Module not found"}
        }

        return "SubModule deleted successfully"
    }
}

module.exports = subModuleServices;