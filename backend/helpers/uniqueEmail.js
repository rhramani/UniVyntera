const User = require("../model/user");
const B2BAdmin = require("../model/masters/b2b/b2bAdmin");
const B2BMember = require("../model/masters/b2b/b2bMember");
const Branch = require("../model/branch/branches");
const BranchMember = require("../model/branch/branchMember");
const CoachingFaculty = require("../model/masters/coachingDetails/coachingFaculty");
const StudentApplication = require("../model/masters/studentApplication/studentApplication");
const Lead = require("../model/lead");

const checkEmailUniqueness = async (email, excludeId = null, excludeModel = null) => {
    if (!email || email.trim() === "") {
    return; // ✅ Skip check if email is empty
  }
    const [userExist, b2bAdminExist , b2bMemberExist, branchExist, branchMember, coachingFaculty, studentApplication, lead] = await Promise.all([
        excludeModel === 'User' ? User.findOne({ _id: { $ne: excludeId}, email })
        : User.findOne({ email }),
        excludeModel === 'B2bAdmin'
            ? B2BAdmin.findOne({ _id: { $ne: excludeId}, email })
            : B2BAdmin.findOne({ email }),
        excludeModel === 'B2BMember' ? B2BMember.findOne({ _id: { $ne: excludeId}, email })
        : B2BMember.findOne({ email }),
        excludeModel === 'Branch' ? Branch.findOne({ _id: {$ne: excludeId}, email})
        : Branch.findOne({email}),
        excludeModel === 'branchMember' ? BranchMember.findOne({ _id: { $ne: excludeId} , email })
        : BranchMember.findOne({email}),
        excludeModel === 'coachingFaculty' ? coachingFaculty.findOne({ _id: { $ne: excludeId} , email})
        : CoachingFaculty.findOne({email}),
        excludeModel === "studentApplication" ? StudentApplication.findOne({ _id: { $ne: excludeId} , email })
        : StudentApplication.findOne({email}),
        excludeModel === "lead" ? Lead.findOne({ _id: { $ne: excludeId} , email })
        : Lead.findOne({ email })
    ]);

    if(userExist || b2bAdminExist || b2bMemberExist || branchExist || branchMember || coachingFaculty || studentApplication || lead) {
        throw { status: false, message: "Email already exists" };
    }
};


module.exports = checkEmailUniqueness;