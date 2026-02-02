const router = require("express").Router();
const { verifyToken } = require("../../../middleware/jwt");

const {
    universityCommission
} = require("../../controller/reports/universityCommissionReports");


router.get("/universityCommission" ,verifyToken, universityCommission);

module.exports = router;        