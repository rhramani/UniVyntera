const CampaignLog = require('../../../model/chatbox/campaignLog');
const Contact = require('../../../model/waDaddy/contact');
const campaignSchema = require('../../../model/chatbox/campaign');

exports.getDashboardCounts = async () => {
  const totalSubscibedContacts = await Contact.countDocuments({
    isSubscribed: true,
  });

  const totalUnsubscibedContacts = await Contact.countDocuments({
    isSubscribed: false,
  });

  const totalCampaigns = await campaignSchema.countDocuments();

  const summary = await CampaignLog.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalSubscibedContacts,
    totalUnsubscibedContacts,
    totalCampaigns,
    summary: summary.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
};

