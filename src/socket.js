
const { Server } = require('socket.io');

let io;

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["websocket", "polling"],
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.auth.userId;
        if (userId) {
            socket.join(userId);
        }
        socket.on('disconnect', (e) => {
            console.log(`User ${userId} disconnected ${e}`,);
        });
    });
};
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = {
    setupSocket,
    getIO
};
