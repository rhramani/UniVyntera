const router = require("express").Router();
const {verifyToken} = require("../../middleware/jwt");

const {
    create,
    update,
    getAll,
    deleteData,
    getOne,
    addVideo
} = require("../controller/promotionalTutorial");


router.post("/create" ,verifyToken, create);
router.patch("/add-doc/:id", verifyToken , addVideo);
router.put("/update/:id/:videoId?/:fileId?" , verifyToken, update);
router.get("/getOne/:id" , verifyToken, getOne);
router.get("/getAll" , verifyToken, getAll);
router.delete("/delete/:id/:videoId?/:fileId?" , verifyToken, deleteData);

module.exports = router;