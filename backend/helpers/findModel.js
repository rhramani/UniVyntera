const User = require("../model/user");
const B2BAdmin = require("../model/masters/b2b/b2bAdmin");
const B2BMember = require("../model/masters/b2b/b2bMember");
const Branch = require("../model/branch/branches");
const BranchMember = require("../model/branch/branchMember");
const CoachingFaculty = require("../model/masters/coachingDetails/coachingFaculty");
const StudentApplication = require("../model/masters/studentApplication/studentApplication");
const Lead = require("../model/lead");

const findUserAndModel = async (email) => {
    const models = [User, B2BAdmin, B2BMember , Branch, BranchMember, CoachingFaculty , StudentApplication, Leado];
  
    for (let model of models) {
      const user = await model.findOne({ email });
      if (user) return { user, model };
    }
    return null;
  };


module.exports = findUserAndModel;