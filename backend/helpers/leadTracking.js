const mongoose = require("mongoose");
const LeadTracking = require("../model/LeadTracking");

async function trackLeadChanges({ leadId, newData, fieldsToTrack }) {
  try {
    const snapshot = { lead: leadId };

    fieldsToTrack.forEach(field => {
      const value = newData[field];

      // Only set if valid value exists
      if (field === 'lead_assign') {
        if (mongoose.Types.ObjectId.isValid(value)) {
          snapshot[field] = value;
        }
      } else {
        snapshot[field] = value || '';
      }
    });

    await LeadTracking.create(snapshot);

  } catch (error) {
    console.error("Error in tracking lead snapshot:", error);
  }
}

module.exports = trackLeadChanges;
