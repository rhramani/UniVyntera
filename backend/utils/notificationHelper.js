const Notification = require("../model/masters/notication/notification");

const {} = require("../socket");
  
async function sendNotifcation({
    recipientId,
    message,
    studentId = null,
    leadId = null,
    createdBy = null,
    notificationType = null
}) {
    const newNotification = await Notification.create({
        recipientId,
        message,
        studentId,
        leadId,
        createdBy,
        notificationType
    });

    const io = getNotificationNamespace();
     if (io) {
    io.to(String(recipientId)).emit("receive_notification", newNotification);
  }

  return newNotification;
}

module.exports = {sendNotifcation};
