const router = require("express").Router();
const {verifyToken} = require("../../../middleware/jwt");

const { createStream,
        updateStream,
        getAllStream,
        deleteStream
    } = require("../../controller/masters/stream-Master");

router.post("/create" , verifyToken  , createStream);
router.put("/update/:id" , verifyToken , updateStream);
router.get("/getAll" , verifyToken , getAllStream);
router.delete("/delete/:id" , verifyToken, deleteStream);

module.exports = router;

