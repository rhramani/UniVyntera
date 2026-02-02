const PromotionalTutorial = require("../../model/promotionalTutorial");
const paginate = require("../../utils/pagination");
const mongoose = require("mongoose")

const PromotionalTutorialServices = {
  create: async (country, userId, userName) => {
    const exists = await PromotionalTutorial.findOne({ country });
    if (exists) throw new Error("Country already exists");

    const result = await PromotionalTutorial.create({
      country,
      created_by: userId,
      createdByName: userName,
    });

    return result;

  },

  addVideo: async (tutorialId, newVideo, userId, userName) => {
    const tutorial = await PromotionalTutorial.findById(tutorialId);
    if (!tutorial) throw new Error("Tutorial country not found");

    const baseName = newVideo.name.trim();

    newVideo.urls.forEach((url, index) => {


      // Ensure name is not duplicated
      // const exists = tutorial.videos.some(
      //   v => v.name.trim().toLowerCase() === baseName.toLowerCase()
      // );
      // if (exists) {
      //   throw new Error(`Video with name "${baseName}" already exists`);
      // }

      tutorial.videos.push({
        name: baseName,
        urls: [{ link: url }],
      });
    });

    tutorial.updated_by = userId;
    tutorial.updatedByName = userName;

    await tutorial.save();
    return tutorial;
  },
  update: async (documentId, videoId, data, userId, userName, fileId = null) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw { status: false, message: "Invalid document ID" };
    }

    const material = await PromotionalTutorial.findById(documentId);
    if (!material) {
      throw { status: false, message: "Tutorial not found" };
    }

    let modified = false;

    // Update country
    if (data.country && data.country !== material.country) {
      const countryExists = await PromotionalTutorial.findOne({
        country: data.country,
        _id: { $ne: documentId },
      });
      if (countryExists) {
        throw { status: false, message: "Country already exists" };
      }
      material.country = data.country;
      modified = true;
    }

    if (videoId) {
      if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw { status: false, message: "Invalid video ID" };
      }

      const video = material.videos.id(videoId);
      if (!video) {
        throw { status: false, message: "Video not found" };
      }

      // Update name (check for duplicate name)
      if (data.name && data.name !== video.name) {
        const duplicate = material.videos.some(
          (v) =>
            v._id.toString() !== videoId &&
            v.name.trim().toLowerCase() === data.name.trim().toLowerCase()
        );
        if (duplicate) {
          throw { status: false, message: "Video name already exists in this country" };
        }

        video.name = data.name;
        modified = true;
      }

      // Replace entire URL list (if data.urls is provided)
      if (Array.isArray(data.urls)) {
        video.urls = data.urls.map((link) => ({ link }));
        modified = true;
      }

      // Replace a specific fileId inside urls
      if (fileId && data.link) {
        const targetUrl = video.urls.id(fileId);
        if (!targetUrl) {
          throw { status: false, message: "Video URL with given ID not found" };
        }
        targetUrl.link = data.link;
        modified = true;
      }
    }

    if (!modified) {
      throw { status: false, message: "No changes made" };
    }

    material.updated_by = userId;
    material.updatedByName = userName;

    await material.save();
    return material;
  },

  getOne: async (id, search) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: false, message: "Invalid ID format" };
    }
    const tutorial = await PromotionalTutorial.findById(id).lean();
    if (!tutorial) {
      throw { status: false, message: "Promotional tutorial not found" };
    }

    // Apply search filter on video names
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      tutorial.videos = tutorial.videos.filter((video) =>
        regex.test(video.name)
      );
    }

    return tutorial;
  },

  getAll: async (page, limit, searchText = "") => {
    const searchOptions = {
      searchText,
      searchFields: ["videos.name", "country"],
    };
    const get = await paginate(
      PromotionalTutorial,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );
    return get;
  },

  delete: async (documentId, videoId = null, fileId = null) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw { status: false, message: "Invalid document ID" };
    }

    const tutorial = await PromotionalTutorial.findById(documentId);
    if (!tutorial) {
      throw { status: false, message: "Promotional tutorial not found" };
    }

    // Case 1: Delete a specific link from a video's urls array
    if (videoId && fileId) {
      if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(fileId)) {
        throw { status: false, message: "Invalid video ID or file ID" };
      }

      const video = tutorial.videos.id(videoId);
      if (!video) {
        throw { status: false, message: "Video not found" };
      }

      const originalLength = video.urls.length;
      video.urls = video.urls.filter(urlObj => urlObj._id.toString() !== fileId);

      if (video.urls.length === originalLength) {
        throw { status: false, message: "File not found in video" };
      }

      await tutorial.save();
      return "Video URL removed successfully";
    }

    // Case 2: Delete entire video from videos array
    if (videoId) {
      const result = await PromotionalTutorial.findByIdAndUpdate(
        documentId,
        { $pull: { videos: { _id: videoId } } },
        { new: true }
      );

      if (!result) {
        throw { status: false, message: "Video not found or already deleted" };
      }

      return "Video removed from promotional tutorial successfully";
    }

    // Case 3: Delete entire document
    await PromotionalTutorial.findByIdAndDelete(documentId);
    return "Promotional tutorial document deleted successfully";
  }

};

module.exports = PromotionalTutorialServices;
