const ApplicationTracking = require("../model//studentTracking");

async function trackApplicationEvent({
    refId,
    refType,
    action,
    description = "",
    changes = {},
    tabName = null,
    userId,
    userName
}) {

    try {
        await ApplicationTracking.create({
            refId,
            refType,
            action,
            description,
            changes,
            tabName,
            created_by: userId,
            createdByName: userName
        })
    } catch (error) {
        console.error("Error tracking application lifecycle event:", error);
    }

}

module.exports = trackApplicationEvent;