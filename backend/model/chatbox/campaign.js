const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fromNumberId: { type: String, required: true }, // WhatsApp phone number ID
    templateId: { type: String },
    templateName : {type: String},
    message : { type: mongoose.Schema.Types.Mixed },
    language: { type: String },
    contactGroup: [{ type: String, required: true }], // List of phone numbers
    parameters: [mongoose.Schema.Types.Mixed], // Array of arrays for each contact
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed','scheduled'], default: 'pending' },
    // admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    campaign_created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String },
    scheduledAt: { type: Date },
}, {
    timestamps: true
});

module.exports = mongoose.model('chatboxCampaign', campaignSchema);
