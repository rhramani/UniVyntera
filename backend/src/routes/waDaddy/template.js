const router = require("express").Router();

const { verifyToken } = require("../../../middleware/jwt");

const templateController = require("../../controller/waDaddy/template");

router.get("/getAll" , verifyToken, templateController.getTemplates);
router.post('/create', verifyToken, templateController.createTemplate);
router.delete("/delete/:name" ,verifyToken, templateController.deleteTemplate)

module.exports = router;