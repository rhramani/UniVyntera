const bcrypt = require("bcrypt");

const Branch = require("../../../model/branch/branches");
const Role = require("../../../model/masters/roles");
const paginate = require("../../../utils/pagination");

const checkEmailUniqueness = require("../../../helpers/uniqueEmail");
const { sendBranchWelcomeEmail } = require("../../../middleware/nodemailer");

const branchServices = {
    create: async (data, userId, userName) => {
        const { name, email, password } = data;
        const checkExist = await Branch.findOne({name})

        await checkEmailUniqueness(email);

        if(checkExist) {
            if(checkExist.name === name) {
                throw { status: false , message: "Branch name already exists"};
            }
        }

        let hashedPassword = null;
        if(password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        const branchRole = await Role.findOne({ name: "Branch"});
        if(!branchRole){
            throw {
                status: false ,
                message: "Branch role not found in Role Collection"
            };
        }


        const newBranch = await Branch.create({
            ...data,
            password: hashedPassword,
            role: branchRole._id,
            created_by: userId,
            createdByName: userName
        })

        await sendBranchWelcomeEmail(email, name, password);
        return newBranch;
    },
    update: async (updateId, updateData , userId , userName) => {
        const { name , email , password} = updateData;
        
        const existingUser = await Branch.findById(updateId);

        if(email && email !== existingUser.email){
            await checkEmailUniqueness(email, updateId, "Branch");
        }
        const checkExist = await Branch.findOne({
            _id: { $ne: updateId},
            $or: [{name}]
        })

        if(checkExist) {
            if(checkExist.name === name) {
                throw { status: false , message: "Branch name already exists"};
            }
            if(checkExist.email === email) {
                throw { status: false , message: "Email already exist"}
            }
        }

        let updatePayload = {
           ...updateData,
                updated_by: userId,
                updatedByName: userName,
        }
        if(password){
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatePayload.password = hashedPassword;
        }

        const updateBranch = await Branch.findByIdAndUpdate(
            updateId,
            updatePayload,
            {
                new: true
            }
        );

        if(!updateBranch) {
            throw { status: false , message: "Branch not found"}
        }
        return updateBranch;
    },
    getById: async (id) => {
        const getOne = await Branch.findById(id);
        if(!getOne) {
            throw { status: false , message: "Branch not found"}
        }
        return getOne;
    },
    getAll: async (page , limit, searchText= "") => {
        //  const get = await Branch.find();
         const searchOptions = { searchText, searchFields: ["name", "email"] };
        const get = await paginate(
            Branch,
            {},
            page,
            limit,
            { createdAt: -1 },
            [],
            searchOptions
        )
        if(!get) {
            throw { status: false , message: "Branch not found"}
        }
        return get;
    },
    delete: async (id) => {
        const deleteData = await Branch.findByIdAndDelete(id);

        if(!deleteData){
            throw { status: false , message: "Branch not found"}
        }
        return "Branch deleted successfully";
    }
};

module.exports = branchServices