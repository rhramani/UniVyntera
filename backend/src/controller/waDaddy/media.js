const fs = require("fs");
const path = require("path");
const mediaService = require("../../services/waDaddy/media");

exports.uploadSampleMedia = async (req, res) => {
    try{
        // const user = req.user;
        const originalExt = path.extname(req.file.originalname);
        const correctPath = `${req.file.path}${originalExt}`;

        fs.renameSync(req.file.path, correctPath);
        const mediaId = await mediaService.uploadMediaToMeta(correctPath);
        fs.unlinkSync(correctPath);

        res.status(200).json({
            status: true,
            code: 200,
            message: mediaId
        })

    }catch(error){
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something went wrong"
        })
    }
}