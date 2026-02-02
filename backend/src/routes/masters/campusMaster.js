const router = require("express").Router();

const {
    createCampus,
    updateCampus,
    getAllCampuses,
    deleteCampus,
    getCampusByCountry
} = require("../../controller/masters/campus-Master");

const {verifyToken} = require("../../../middleware/jwt");

router.post("/create" , verifyToken, createCampus);
router.put("/update/:id" , verifyToken, updateCampus);
router.get("/getAll" ,verifyToken, getAllCampuses);
router.delete("/delete/:id" , verifyToken, deleteCampus);
router.get("/getCampus" , verifyToken, getCampusByCountry);

module.exports = router;
