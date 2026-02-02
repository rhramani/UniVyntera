const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contactIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'wadaddycontact',
    },
  ],
  description: { type: String },
  // admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group_created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByName: {
    type: String
  }
},{
    timestamps: true
});

module.exports = mongoose.model('wadaddygroup', groupSchema);
