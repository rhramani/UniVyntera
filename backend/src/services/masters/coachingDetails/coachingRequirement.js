const coachingRequirement = require("../../../../model/masters/coachingDetails/coachingRequirement");
const paginate = require("../../../../utils/pagination");

const coachingRequirementServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const nameExist = await coachingRequirement.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Coaching requirement already exists",
      };
    }

    const newData = await coachingRequirement.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },
  update: async (id, data, userId, userName) => {
    const { name } = data;

    const requirement = await coachingRequirement.findById(id);
    if (!requirement) {
      throw { status: false, message: "Coaching requirement not found" };
    }

    if (name) {
      const nameExist = await coachingRequirement.findOne({
        name,
        _id: { $ne: id },
      });

      if (nameExist) {
        throw {
          status: false,
          message: "Coaching requirement with this name already exist",
        };
      }
    }

    const updateData = await coachingRequirement.findByIdAndUpdate(
      id,
      {
        ...data,
        updated_by: userId,
        updatedByName: userName,
      },
      {
        new: true,
      }
    );

    return updateData;
  },
  getAll: async (page, limit, searchText = "") => {
    const searchOptions = { searchText, searchFields: ["name"] };

    const result = await paginate(
      coachingRequirement,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );
    return result;
  },
  deleteData: async (id) => {
    const result = await coachingRequirement.findByIdAndDelete(id);

    if(!result){
      throw {
        status: false,
        message: "Coaching requirement not found or already deleted"
      }
    }
    return "Coaching requirement deleted successfully";
  }
};

module.exports = coachingRequirementServices;
