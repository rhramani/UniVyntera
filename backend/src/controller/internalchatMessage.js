const internalchatMessageServices = require("../services/internalchatMessage");


const getChatUserList = async (req, res) => {
    try{
        const currentUserId = req.user.userId;
        const result = await internalchatMessageServices.getChatUserList(currentUserId);
        return res.status(200).json({
            status: true,
            code: 200,
            message: result
        })
    }catch(error){
        res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something Went Wrong"
        })
    }
};


const getConversation = async (req, res) => {
    try{
          const { conversationId } = req.params;

          const result = await internalchatMessageServices.getConversation(conversationId);

          return res.status(200).json({
            status: true,
            code: 200,
            message: result
        })
    }catch(error){
    res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Something Went Wrong"
        })
    }
}


module.exports = {
    getChatUserList,
    getConversation
}