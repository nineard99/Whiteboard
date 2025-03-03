'use client'
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Copy, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import socket from "@/app/socket/socket";

interface RoomProps {
  onStart: () => void;
}



const Room : React.FC<RoomProps>   = ({onStart}) => {
  const { id: roomId } = useParams<{ id: string }>();  // ดึง roomId จาก URL
  const [users, setUsers] = useState<string[]>([]); // กำหนดประเภทเป็น string[]

  const [chatOpen, setChatOpen] = useState(false);
  const router = useRouter();
  const handleCopyCode = () => {
    if (navigator.clipboard && roomId) {
      navigator.clipboard.writeText(roomId).catch(() => fallbackCopyText(roomId));
    } else {
      fallbackCopyText(roomId);
    }
  };
  
  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };
  
  useEffect(() => {
    if (roomId) {
        socket.emit('join_room', roomId);

        socket.on("update_users", (users: string[]) => {
            setUsers(users);  // รีเซ็ตรายชื่อผู้ใช้ใหม่
        });

        socket.on("room_not_found", (room: string) => {
            alert(`Room ${room} does not exist.`);
        });
    }

    // Clean up เมื่อ component ถูก unmount
    return () => {
        socket.off("update_users");
        socket.off("room_not_found");
        socket.off("disconnect");
        

    };
  }, [roomId]);


  // Handle chat toggle
  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => {
            socket.disconnect();
            router.push(`/`)
            setTimeout(() => {
              window.location.reload(); // รีเฟรชหน้าใหม่หลังจากเปลี่ยนหน้าแล้ว
            }, 100); 
          }} 
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="text-gray-300" size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center text-white ml-2">Room</h2>
        <button 
          onClick={handleChatToggle} 
          className={`p-2 hover:bg-gray-700 rounded-full ml-auto transition-colors ${chatOpen ? 'bg-gray-700' : ''}`}
        >
          <MessageCircle className="text-gray-300" size={20} />
        </button>
      </div>
      
      <div className="flex mb-4">
        <div className="flex-1">
          <h3 className="text-gray-300 mb-3">Players</h3>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user} className="flex items-center p-3 bg-gray-700 rounded-lg">
                <img 
                  src={'@/img'} 
                  alt={user} 
                  className="w-8 h-8 rounded-full mr-3" 
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-white font-medium">{user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {chatOpen && (
          <div className="w-64 ml-4 bg-gray-700 rounded-lg p-3 flex flex-col h-64">
            <div className="text-gray-300 mb-2">Chat</div>
            <div className="flex-1 overflow-y-auto mb-2 text-sm">
              <div className="mb-2">
                <span className="text-purple-400 font-medium">You: </span>
                <span className="text-white">Hello!</span>
              </div>
              <div>
                <span className="text-blue-400 font-medium">Guest: </span>
                <span className="text-white">Hi, ready to draw?</span>
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="w-full p-2 bg-gray-600 text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-700">
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 text-sm">Room Code</label>
        <div className="flex items-center">
          <div className="flex-1 p-3 bg-gray-700 text-white rounded-lg font-mono">
            {roomId}
          </div>
          <button
            onClick={handleCopyCode}
            className="ml-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Copy size={20} className="text-gray-300" />
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-2">Share this code with your friend</p>
      </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-300">Game Settings</div>
          <div className="text-gray-400 text-sm">Round Time: 60s</div>
        </div>
        
        <button
        onClick={onStart}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90` }>
          Start
        </button>
      </div>
    </div>
  );
};

export default Room;
