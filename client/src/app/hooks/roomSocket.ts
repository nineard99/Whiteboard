import React, { useState } from 'react'
import socket from "@/app/socket/socket";


export default function roomSocket() {
    const [roomState, setRoomState] = useState<'default' | 'create' | 'join' | 'room'>('default');
    // const [roomCode, setRoomCode] = useState('DRAW-4821');
    const [roomCode, setRoomCode] = useState('');

    const createRoom = (room: string) => {
        socket.emit('create_room', room); // สร้างห้องใหม่
        setRoomCode(room);
        setRoomState('room')
    };

    const joinRoom = (room: string) => {
        socket.emit('join_room', room); // เข้าห้องที่มีอยู่แล้ว
        setRoomState('room')

    };
    
    return {roomState,setRoomState,roomCode,setRoomCode,createRoom,joinRoom}
}
