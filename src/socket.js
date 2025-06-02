
const { Server } = require('socket.io');

let io;

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) socket.join(userId);

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
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
