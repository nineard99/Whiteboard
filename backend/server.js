const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 4000;

app.use(cors());


const server = http.createServer(app);  // Create server with Express app
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`user Connect ${socket.id}`);
    socket.on("join_room",(data) =>{
        socket.join(data)
    }) 
    socket.on("sent_message",(data) =>{
        socket.to(data.room).emit("receive_message",data)
    }) 
});


server.listen(PORT, () => {   // Listen using 'server' object, not app.listen
    console.log('Server Start');
});
