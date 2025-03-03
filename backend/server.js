const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors());


const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: 'http://10.5.159.190:3000',
        methods: ["GET", "POST"],
    },
});


const rooms = {};
let drawData = {};
io.on("connection", (socket) => {
    
    socket.on("draw", (data) => {
        if (data.roomId) {
            if (!drawData[data.roomId]) {
                drawData[data.roomId] = [];
            }
            

            drawData[data.roomId].push(data);
            io.to(data.roomId).emit("draw", data);
        }
    });

    socket.on("clearCanvas", (data) => {
        const { roomId } = data;
        if (roomId && drawData[roomId]) {
            drawData[roomId] = [];
        }
        io.to(roomId).emit("clearCanvas");
    });

    socket.on("joincanvas", (room) => {
        
        socket.join(room);
        console.log(`User joined room: ${room}`);

        
        if (drawData[room]) {
            socket.emit("loadCanvas", drawData[room]);
        }

    });

    socket.on("create_room", (room) => {
        socket.join(room); 

     
        if (!rooms[room]) {
            rooms[room] = new Set();
        }

        console.log(`Room ${room} created by user ${socket.id}`);
        io.to(room).emit("update_users", Array.from(rooms[room])); 
        console.log(`Users in room ${room}:`, Array.from(rooms[room]));

        socket.emit("room_created", room); 
    });
    
    socket.on("leave_room", (room) => {
        socket.leave(room); 
        console.log(`User ${socket.id} left room ${room}`);
      });

    socket.on("join_room", (room) => {
        if (rooms[room]) {
            socket.join(room); 
            rooms[room].add(socket.id); 
            console.log(`User ${socket.id} joined room ${room}`);
            console.log(`Users in room ${room}:`, Array.from(rooms[room]));

            io.to(room).emit("update_users", Array.from(rooms[room])); 
            
        } else {
            console.log(`Room ${room} does not exist.`);
            socket.emit("room_not_found", room);
        }
    });
  

    socket.on("disconnect", () => {
        for (const room in rooms) {
            if (rooms[room].has(socket.id)) {
                rooms[room].delete(socket.id);
                console.log(`User ${socket.id} left room ${room}`);
                if (rooms[room].size === 0) {
                    delete rooms[room];
                    delete drawData[room];

                } else {
                    io.to(room).emit("update_users", Array.from(rooms[room])); // อัปเดตรายชื่อผู้ใช้
                }
            }
        }
    });
});


server.listen(PORT, () => {  
    console.log('Server Start');
});
