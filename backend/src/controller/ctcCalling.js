const {
  callEntity,
  callDialerEntity,
  ctcPingBack,
  ctcWebhook,
} = require("../services/ctcCalling");
const { getCTCCredentials } = require("../services/configuration");

const callingLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { entityType } = req.query;
    const agentId = req.user.userId;

    if (!entityType) {
      return res.status(400).json({
        status: false,
        message: "entityType is required",
      });
    }

    const result = await callEntity(entityType, leadId, agentId);

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const callFromDialer = async (req, res) => {
  try{
    const { number } = req.body;
    const agentId = req.user.userId;


    const result = await callDialerEntity(number, agentId);    
  
    return res.status(200).json({
      status: true,
      code: 200,
      data: result
    })

  }catch(error){                           
    res.status(500).json({
      status: false,
      code:500,
      message: error.message || "Something went wrong"    
    })
  }
}

const CTCPingBack = async (req, res) => {
  try {
    const config = await getCTCCredentials();

    if (
      config.CTC_PINGBACK_SECRET &&
      req.headers["x-ctc-sercret"] !== config.CTC_PINGBACK_SECRET
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await ctcPingBack(req.body);

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const webhook = async (req, res) => {
  try {
    await ctcWebhook(req.body);

    return res.status(200).json({
      status: true,
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = { callingLead, callFromDialer, CTCPingBack, webhook };
