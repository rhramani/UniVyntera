const router = require("express").Router();

const { 
    createRole,
    updateRole,
    getRoleById,
    getAllRoles,
    deleteRoles,
    getAllRolesWithoutPagination
} = require("../../controller/masters/rolesMaster");

const {verifyToken, optionalVerifyToken} = require("../../../middleware/jwt");

router.post("/create" ,verifyToken, createRole);
router.put("/update/:id" ,verifyToken, updateRole);
router.get("/get/:id" ,verifyToken, getRoleById);
router.get("/getAll" ,verifyToken, getAllRoles);
router.delete("/delete/:id" ,verifyToken, deleteRoles);
router.get("/getAllRolesWithoutPagination", optionalVerifyToken, getAllRolesWithoutPagination)


module.exports = router;