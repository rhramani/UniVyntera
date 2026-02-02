const chatMessageService = require("../services/chatMessage");

const getChatMessages = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { page, limit, search = "" } = req.query;

    const result = await chatMessageService.getAll(studentId, page, limit, search);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getUnreadMessageCounts = async (req, res) => {
  try {
    const result = await chatMessageService.getUnreadMessageCounts(req.user);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    })
  } catch (error) {
    console.log("errorerror" , error);
     res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const associatedUser = async (req, res) => {
   try {
    const { userId } = req.params;
    // Find all chat threads where the user is a sender
    const result = await chatMessageService.associatedUser(userId);
    
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching associated students:", error);
    res.status(500).json({ error: "Failed to fetch associated students" });
  }
} 



module.exports = { getChatMessages, getUnreadMessageCounts ,associatedUser};
