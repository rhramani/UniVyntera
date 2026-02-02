const CourseTag = require("../../../model/masters/courseTags");


const tagColors = [
  "#9e591c", "#6BCB77", "#4D96FF", "#FFB703",
  "#660ead", "#96b81a", "#F15BB5", "#8AC926",
  "#d383de", "#1982C4", "#8338EC", "#F77F00"
]; 

const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const courseTagServices = {
  create: async (name) => {
    if (!name || typeof name !== "string") {
      throw { status: false, message: "Invalid tag name" };
    }

    const trimmedName = name.trim();
    const existing = await CourseTag.findOne({ name: trimmedName });
    if (existing) throw { status: false, message: "Tag already exists" };

    const usedColors = await CourseTag.distinct("color");
    let selectedColor;

    if (usedColors.length < tagColors.length) {
      const availableColors = tagColors.filter(color => !usedColors.includes(color));
      selectedColor = getRandomFromArray(availableColors);
    } else {
      // All colors used — reuse from full list
      selectedColor = getRandomFromArray(tagColors);
    }

    const tag = await CourseTag.create({ name: trimmedName, color: selectedColor });
    return tag;
  },
  update: async (id, newName) => {
    if (!newName || typeof newName !== "string") {
        throw { status: false, message: "Invalid tag name" };
      }
    const trimmedName = newName.trim();

    const existing = await CourseTag.findOne({ name: trimmedName});
    if(existing && existing._id.toString() !== id){
        throw { status: false, message: "Another tag with this name already exists"}
    }

    const updated = await CourseTag.findByIdAndUpdate(
        id,
        { name: trimmedName },
        { new: true}
    );

    if(!updated) {
        throw { status: false, message: "Tag not found"};
    }

    return updated

  },
   getAll: async (searchText = "") => {
  const query = {};

  if (searchText) {
    query.name = { $regex: searchText, $options: "i" }; // case-insensitive search
  }

  const getAll = await CourseTag.find(query);

  if (!getAll || getAll.length === 0) {
    throw { status: false, message: "No tags found" };
  }

  return getAll;
},

   deleteTag :  async (id) => {
    const deleteTag = await CourseTag.findByIdAndDelete(id);
    if(!deleteTag){
        throw {status: false , message: "No tags found"}
    }
    return "Tag deleted successfully"
   }
};

module.exports = courseTagServices;
