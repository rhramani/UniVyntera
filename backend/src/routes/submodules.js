const router = require("express").Router();

const {
    createSubModule,
    updateSubModule,
    getSubModuleById,
    getAllSubModules,
    deleteSubModuleById
} = require("../controller/subModules");

router.post("/create" , createSubModule);
router.put("/update/:id" , updateSubModule);
router.get("/get/:id" , getSubModuleById);
router.get("/getAll" , getAllSubModules);
router.delete("/delete/:id" , deleteSubModuleById);

module.exports = router;