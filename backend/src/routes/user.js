const router = require("express").Router();

const uploadDisk = require("../../middleware/uploadLocallyMulter");
const {verifyToken, optionalVerifyToken} = require("../../middleware/jwt");

const { userRegistration,
        requestOTP,
        userLogin,
        updateUser,
        getOneUser,
        getAllUser,
        getAllCounselor,
        deleteUser,
        getLoginHistory,
        globalIpRestriction
      }  = require("../controller/user");

router.post("/create" ,verifyToken, userRegistration);
router.post("/requestOTP", requestOTP);
router.post("/login" , userLogin);
router.put("/update/:id" ,verifyToken, uploadDisk, updateUser);
router.get("/getOne/:id", verifyToken,getOneUser);
router.get("/getAll" ,optionalVerifyToken, getAllUser);
router.get("/getCounselors/:id" , verifyToken, getAllCounselor);
router.delete("/delete/:id" , verifyToken, deleteUser);
router.get("/loginHistory", verifyToken, getLoginHistory);
router.put("/globalIpRestriction" , verifyToken, globalIpRestriction);

module.exports = router;