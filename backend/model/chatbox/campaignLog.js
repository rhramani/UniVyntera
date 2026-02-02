const mongoose = require('mongoose');

const campaignLogSchema = new mongoose.Schema({
  date: Date,
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'chatboxCampaign' },
  contact: String,
  messageId: String,
  status: String,
  deliveredTime: Date,
  whatsappStatus: String,      // e.g., 'sent', 'delivered', 'read', 'failed'
  whatsappStatusDate: Date,
  // admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

module.exports = mongoose.model('chatboxCampaignLog', campaignLogSchema);
