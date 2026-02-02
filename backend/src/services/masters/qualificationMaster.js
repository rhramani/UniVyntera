const Qualification = require("../../../model/masters/qualification");

const paginate = require("../../../utils/pagination");

const qualificationServices = {
    createQualification: async (data , userId, userName) => {
        const { qualification } = data;

        if(!qualification) throw { status: false, message: "Qualification is required"}

        const exists  = await Qualification.findOne({qualification} )
        if(exists) {
            throw { status: false , message: "Qualification already exists" }
        }
        
        const newQualification = await Qualification.create({
            qualification,
            created_by: userId,
            createdByName: userName
        })

        return newQualification;
    },

    updateQualification : async (updateId , updateData, userId, userName) => {
        const checkExist = await Qualification.findOne({ qualification: updateData.qualification });

        if(checkExist && checkExist._id.toString() !== updateId) {
            throw { status : false, message: "Qualification already exists"};
        }

        const update = await Qualification.findByIdAndUpdate(
            updateId,
            { ...updateData,
                updated_by: userId,
                updatedByName: userName
            },
            {new: true}
        )

        return update;
    },
    getAllQualification : async (page, limit, searchText = "") => {
        const populateFields = [
            { path: "created_by" , select: "name"}
          ];

        const searchOptions = { searchText, searchFields: ["qualification"] };

        const qualifications = await paginate(Qualification, {} , page, limit , { createdAt: -1}, populateFields, searchOptions);

        if(!qualifications || qualifications.totalRecords === 0) {
            throw { status: false, message: "No qualifications found" }
        }
        return qualifications; 
    },
    deleteQualification : async (deleteId) => {
        const checkExist = await Qualification.findByIdAndDelete(deleteId);

        if(!checkExist) {
            throw { status: false , message: "Qualification not found"}
        }
        return "Qualification deleted successfully";
    }
}

module.exports = qualificationServices;