
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const https = require("https");

require("dotenv").config();
require("./db/connection");
require("./utils/cron");
const { initSocket, getIO, getWadaddyNamespace } = require("./socket.js");

// WaDaddy 
// const { getApiSetup } = require("./helpers/wadaddyApi.js");

// Chatbox
const { getApiSetup } = require("./helpers/chatboxApi.js");
const config = getApiSetup();

// app.use(
//     cors({
//       origin: [
//         "http://localhost:5173",
//         "http://localhost:3000",,
//       ],
//       credentials: true,
//     })
// );

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/public", express.static(path.join(__dirname, "public")));

// api route
const routes = require("./src/routes/allRoutes");
app.use("/api", routes);

// waDaddy web hooks
const Contact = require("./model/waDaddy/contact");
const CampaignLogModel = require("./model/chatbox/campaignLog");
const User = require("./model/user.js");
const Message = require("./model/chatbox/message.js");



app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "zokepcrmtoken") {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.warn("Webhook verification failed");
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log("webhook POST received:", JSON.stringify(body, null, 2));

    if (body.object && body.entry) {
      for (const entry of body.entry) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;

          if (value?.statuses) {
            for (const statusEntry of value.statuses) {
              const messageId = statusEntry.id;
              const status = statusEntry.status;
              const recipient = statusEntry.recipient_id;
              const timestamp = new Date(Number(statusEntry.timestamp) * 1000);

              console.log(
                ` Status: ${status} for ${recipient} (msg ID: ${messageId})`
              );

              const updateData = {
                status: status !== "failed" ? "sent" : "failed",
                whatsappStatus: status,
                whatsappStatusDate: timestamp,
              };

              if (status === "delivered") updateData.deliveredTime = timestamp;

              const campaignUpdated = await CampaignLogModel.findOneAndUpdate(
                { messageId },
                updateData,
                { new: true }
              );

              if (campaignUpdated) {
                await Message.findByIdAndUpdate(
                  { messageId },
                  {
                    status,
                  },
                  {
                    new: true,
                  }
                );
              } else {
                const messageUpdated = await Message.findOneAndUpdate(
                  { messageId },
                  {
                    status,
                  },
                  { new: true }
                );

                if (messageUpdated) {
                  try {
                    const wadaddyNamespace = getWadaddyNamespace();

                    // Decide which room to emit to:
                    // - If message has admin_id, emit to that admin room
                    // - else if it has 'from' or 'to' fields that map to users, use those

                    // const adminRoom = messageUpdated.admin_id?.toString();
                    // if (adminRoom) {
                    wadaddyNamespace
                      .to("all-users")
                      .emit("message:status_update", {
                        messageId: messageUpdated.messageId,
                        status,
                        timestamp,
                      });
                    // }
                  } catch (emitErr) {
                    console.error("Emit error:", emitErr.message);
                  }
                } else {
                  console.warn(
                    "⚠️ No message found in CampaignLog or MessageModel for:",
                    messageId
                  );
                }
              }
            }
          }

          if (value?.messages) {
            let type;
            let text;

            const message = value.messages[0];
            if (message.type === "button") {
              text = message.button.text;
            } else {
              text = message.text?.body;
            }

            const from = message.from;
            type = message.type;
            const wabaId = entry.id;

            // const adminData = await User.findOne({ wabaId });

            await Contact.findOneAndUpdate(
              { phoneNumber: from },
              {
                lastMessageTime: new Date(),
                lastIncomingMessageTime: new Date(),
                newMessage: true,
              },
              { new: true }
            );

            await Message.create({
              from,
              to: config?.registeredNumber,
              messageId: message.id,
              text,
              type,
              timestamp: new Date(Number(message.timestamp) * 1000),
              direction: "inbound",
              wabaId,
              phoneNumberId: value.metadata?.phone_number_id,
            });

            // const io = getIO();
            // io.emit("new-message", {
            //   from,
            //   to: config?.registeredNumber,
            //   messageId: message.id,
            //   text,
            //   type,
            //   timestamp: new Date(Number(message.timestamp) * 1000),
            //   direction: "inbound",
            // });
            const wadaddyNamespace = getWadaddyNamespace();
            wadaddyNamespace.to("all-users").emit("new-message", {
              from,
              to: config?.registeredNumber,
              messageId: message.id,
              text,
              type,
              timestamp: new Date(Number(message.timestamp) * 1000),
              direction: "inbound",
            });

            if (text?.trim().toLowerCase() === "stop") {
              // Match contact based on number and optionally use wabaId
              const contact = await Contact.findOneAndUpdate(
                { phoneNumber: from },
                {
                  isSubscribed: false,
                },
                { new: true }
              );

              if (contact) {
                console.log(`📴 ${from} unsubscribed`);
              } else {
                console.warn(`⚠️ No contact found for phone: ${from}`);
              }
            }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500);
  }
});


// const privateKey = fs.readFileSync("/etc/letsencrypt/live/zokepconsultant.com/privkey.pem", "utf8");
// const certificate = fs.readFileSync("/etc/letsencrypt/live/zokepconsultant.com/fullchain.pem", "utf8");

// const credentials = { key: privateKey, cert: certificate };

// const server = https.createServer(credentials, app);
const server = http.createServer(app);

initSocket(server);

// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   },
// });

// require("./socket")(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`server is running successfully on PORT ${PORT} 🤖`);
});
