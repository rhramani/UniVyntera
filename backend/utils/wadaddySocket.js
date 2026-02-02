const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET" , "POST"],
        }
    });

    io.on("connection", (socket) => {
        console.log("👤 New Socket Connected");

        socket.on("join" , (userId) => {
            socket.join(userId);
            console.log(`🔗 USER Joined Room: ${userId}`);
        });

        socket.on("disconnect" , () => {
            console.log("❌ Socket disconnected")
        })
    });

    return io;
}

const getIO = () => {
    if(!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = {
    initSocket,
    getIO
}