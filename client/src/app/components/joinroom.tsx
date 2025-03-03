import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface JoinRoomProps {
    onBack: () => void; // ฟังก์ชันปิดหน้าสร้างห้อง

}

const JoinRoom: React.FC<JoinRoomProps> = ({ onBack  }) => {
  const [roomCode, setRoomCode] = useState('');

  const router = useRouter();

  const joinRoom = (): void => {
    if (roomCode) {
        router.push(`/canvas/${roomCode}`);
    }
};
    

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="text-gray-300" size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white ml-2">Join Room</h2>
      </div>

      <form action={() => {
        joinRoom()
        }}>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 text-sm">Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code (e.g. DRAW-1234)"
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
          />
        </div>



        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors  bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90`}>
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;