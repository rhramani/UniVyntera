const router = require("express").Router();

const {
    createB2BMember,
    updateB2BMember,
    getB2BMemberById,
    getAllB2BMembers,
    deleteB2BMembers,
    getMemberByAdmin
} = require("../../../controller/masters/b2b/b2bMember");

const {verifyToken} = require("../../../../middleware/jwt");

router.post("/create" , verifyToken, createB2BMember);
router.put("/update/:id", verifyToken, updateB2BMember);
router.get("/getOne/:id" ,verifyToken, getB2BMemberById);
router.get("/getAll" , verifyToken, getAllB2BMembers);
router.delete("/delete/:id" , verifyToken, deleteB2BMembers);
router.get("/getMembers/:id" , verifyToken, getMemberByAdmin);

module.exports = router;