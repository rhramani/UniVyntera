const mongoose = require('mongoose');

const leadTrackingSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  name: String,
  phone: String,
  city: String,
  lead_form: String,
  lead_assign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }, 
  remarks: String,
  lead_text_remark: String
}, { timestamps: true });

module.exports = mongoose.model('LeadTracking', leadTrackingSchema);
