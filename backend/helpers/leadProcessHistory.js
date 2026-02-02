const User = require("../model/user");
const Role = require("../model/masters/roles");
const Branch = require("../model/branch/branches");
const LeadProcessHistory = require("../model/studentProcessHistory");
const FollowUpType = require("../model/masters/lead/followUpType");

async function trackLeadEvents(oldLead, newData, userId, userName) {
  const events = [];

  for (const field in newData) {
    const newValue = newData[field];
    const oldValue = oldLead[field];

    // Skip unchanged values
    if (String(oldValue) === String(newValue)) continue;

    // Skip invalid values
    if (
      newValue === undefined ||
      newValue === null ||
      newValue === "" ||
      newValue === "Invalid Date"
    ) {
      continue;
    }

    switch (field) {
      case "lead_assign":
        if (!newValue) break; // skip null/undefined
        const assignedUser = await User.findById(newValue).select("name");
        if (!assignedUser) break; // skip invalid user
        events.push({
          event: "lead_assigned",
          value: assignedUser.name,
        });
        break;

      case "lead_role":
        if (!newValue) break;
        const role = await Role.findById(newValue).select("name");
        if (!role) break;
        events.push({
          event: "lead_role_changed",
          value: role.name,
        });
        break;

      case "lead_assign_Branch":
        if (!newValue) break;
        const branch = await Branch.findById(newValue).select("name");
        if (!branch) break;
        events.push({
          event: "lead_branch_assigned",
          value: branch.name,
        });
        break;

      case "lead_status":
        events.push({
          event: "lead_status",
          value: newValue,
        });
        break;

      case "lead_sub_status":
        events.push({
          event: "lead_sub_status",
          value: newValue,
        });
        break;

      case "next_follow_up":
        const formatted = new Date(newValue).toLocaleString("en-IN");
        if (formatted !== "Invalid Date") {
          events.push({
            event: "next_followup",
            value: formatted,
          });
        }
        break;

      case "follow_up_type":
        if (!newValue) break;

        try {
          const followUpType = await FollowUpType.findById(newValue).select(
            "name"
          );

          events.push({
            event: "followup_type",
            value: followUpType?.name || newValue,
          });
        } catch {
          events.push({
            event: "followup_type",
            value: newValue,
          });
        }
        break;

      case "follow_up_completed":
        if (newValue === true) {
          events.push({
            event: "followup_completed",
            value: "Completed",
          });
        }
        break;

      case "remarks":
        if (newValue?.trim()) {
          events.push({
            event: "remarks_updated",
            value: newValue,
          });
        }
        break;

      case "lead_text_remark":
        if (newValue?.trim()) {
          events.push({
            event: "text_remark_updated",
            value: newValue,
          });
        }
        break;

      default:
        break;
    }
  }

  if (events.length === 0) return;

  // ⭐ GET FULL HISTORY TO CHECK EVENT-BY-EVENT DUPLICATION
  const historyDoc = await LeadProcessHistory.findOne(
    { leadId: oldLead._id },
    { history: 1 }
  );

  const filteredEvents = [];

  for (const e of events) {
    // Find the last same event type
    const lastSameEvent = historyDoc?.history
      ?.slice()
      .reverse()
      .find((h) => h.event === e.event);

    // If last same event exists AND value matches → skip
    if (lastSameEvent && String(lastSameEvent.value) === String(e.value)) {
      continue;
    }

    filteredEvents.push(e);
  }

  // If no new unique events, skip
  if (filteredEvents.length === 0) return;

  // ⭐ PUSH ONLY UNIQUE NEW EVENTS
  await LeadProcessHistory.updateOne(
    { leadId: oldLead._id },
    {
      $push: {
        history: filteredEvents.map((e) => ({
          ...e,
          updatedBy: userId,
          updatedByName: userName,
          date: new Date(),
        })),
      },
    },
    { upsert: true }
  );
}

module.exports = trackLeadEvents;
