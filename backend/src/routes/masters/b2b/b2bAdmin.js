const router = require("express").Router();

const {
    createB2bAdmin,
    updateB2BAdmin,
    getAllB2BAdmins,
    b2bCountry,
    getB2BAdminById,
    deleteB2BAdmin,
    bulkAddB2BAdmins,
    downloadB2bAdmin
} = require("../../../controller/masters/b2b/b2bAdmin");

const {verifyToken, optionalVerifyToken} = require("../../../../middleware/jwt");
const uploadDisk = require("../../../../middleware/uploadLocallyMulter");

router.post("/create" ,optionalVerifyToken, uploadDisk, createB2bAdmin);
router.put("/update/:id" , verifyToken, uploadDisk, updateB2BAdmin);
router.get("/getAll" , verifyToken, getAllB2BAdmins);
router.get("/countryList" , verifyToken, b2bCountry);
router.get("/getOne/:id" , verifyToken, getB2BAdminById);
router.delete("/delete/:id" , verifyToken, deleteB2BAdmin);
router.post("/bulk-add" , verifyToken,uploadDisk, bulkAddB2BAdmins);
router.get("/download" , verifyToken, downloadB2bAdmin);

module.exports = router;