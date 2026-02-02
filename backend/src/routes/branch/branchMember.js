const router = require("express").Router();

const {
    createBranchMember,
    updateBranchMember,
    getBranchMemberById,
    getAllBranchMembers,
    deleteBranchMember,
    getMemberByBranch
} = require("../../controller/branch/branchMember");

const {verifyToken} = require("../../../middleware/jwt");

router.post("/create" , verifyToken, createBranchMember);
router.put("/update/:id", verifyToken, updateBranchMember);
router.get("/getOne/:id" ,verifyToken, getBranchMemberById);
router.get("/getAll" , verifyToken, getAllBranchMembers);
router.delete("/delete/:id" , verifyToken, deleteBranchMember);
router.get("/getMembers/:id" , verifyToken, getMemberByBranch);

module.exports = router;