
const express = require('express');
const router = require('./routes/userRoutes'); // Keep for user search
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const favoriteHandler = require('./socketHandlers/favoriteHandler'); // Import favoriteHandler

const app = express();
const PORT = 6262;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(router); // Use router for user search only

io.on('connection', (socket) => {
    console.log('a user connected');
    favoriteHandler(io, socket); // Pass io and socket to the handler

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
