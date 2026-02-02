const router = require("express").Router();

const {
    createInstitute,
    updateInstitute,
    getInstituteById,
    getAllInstitutes,
    deleteInstitute,
    getCountryFromPackage,
    getStateFromPackage,
    getCityfromPackage,
    getInstituteNamesAndCountries,
    countriesOfInstitute,
    campusOfInstitute,
    programLevelsOfInstitute,
    getInstituteByCountry
} = require("../../controller/masters/directInstitute");


const {verifyToken} = require("../../../middleware/jwt");
const uploadDisk = require("../../../middleware/uploadLocallyMulter");

router.post("/create" , verifyToken, uploadDisk, createInstitute);
router.put("/update/:id" , verifyToken, uploadDisk , updateInstitute);
router.get("/getById/:id" , verifyToken , getInstituteById);
router.get("/getAll" , verifyToken , getAllInstitutes);
router.delete("/delete/:id" , verifyToken , deleteInstitute);


router.get("/countryDD", getCountryFromPackage);
router.get("/stateDD", getStateFromPackage);
router.get("/cityDD", getCityfromPackage);
router.get("/universityCountryDD", getInstituteNamesAndCountries);
router.get("/countryList" , countriesOfInstitute);
router.get("/campusList" , campusOfInstitute);
router.get("/programLevelList" , programLevelsOfInstitute);
router.get("/countryWiseInstitute" , getInstituteByCountry);

module.exports = router;