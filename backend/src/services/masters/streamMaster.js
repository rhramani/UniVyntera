const Stream = require("../../../model/masters/stream");
const paginate = require("../../../utils/pagination");

const streamServices = {
  createStream: async (streamData, userId) => {
    const { qualification, stream } = streamData;

    if (!qualification || !stream) {
      throw { status: false, message: "Qualification and Stream are required" };
    }

    // Check for duplicate stream under same qualification
    const checkExist = await Stream.findOne({ qualification, stream });
    if (checkExist) {
      throw { status: false, message: "Stream already exists for this qualification" };
    }

    const newStream = await Stream.create({
      qualification,
      stream,
      created_by: userId
    });

    return newStream;
  },

  updateStream: async (updateId, updateData) => {
    const { qualification, stream } = updateData;

    // Check for duplicate (exclude current record)
    const checkExist = await Stream.findOne({
      qualification,
      stream,
      _id: { $ne: updateId }
    });

    if (checkExist) {
      throw { status: false, message: "Stream already exists for this qualification" };
    }

    const update = await Stream.findByIdAndUpdate(
      updateId,
      { ...updateData },
      { new: true }
    );

    if (!update) {
      throw { status: false, message: "Stream not found" };
    }

    return update;
  },

  getAllStream: async (page, limit, searchText = "") => {

    const populateFields = [{ path: "qualification", select: "qualification" }, { path: "created_by" , select: "name"}];
    const searchOptions = { searchText, searchFields: ["stream"] };
    const getStreams = await paginate(
      Stream,
      {},
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getStreams || getStreams.totalRecords === 0) {
      throw { status: false, message: "No Streams found" };
    }

    return getStreams;
  },

  deleteStream: async (deleteId) => {
    const checkStream = await Stream.findByIdAndDelete(deleteId);

    if (!checkStream) {
      throw { status: false, message: "Stream not found" };
    }

    return "Stream deleted successfully";
  }
};

module.exports = streamServices;
