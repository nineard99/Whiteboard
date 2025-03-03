import React from 'react'

interface HomeProps {
  createRoom: () => void; // ฟังก์ชันปิดหน้าสร้างห้อง
  joinRoom: () => void;
}

export const Home: React.FC<HomeProps> = ({createRoom,joinRoom}) => {

  
  return (
    <div>
        <h1 className="text-white text-6xl font-bold mb-12 tracking-tight">
          Drawing
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Together
          </span>
        </h1>

        <div className="space-y-6">
          <div className="space-x-4">
            <button onClick={createRoom}
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
              Create Private Room
            </button>
            <button onClick={joinRoom}
            className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm">
              Join Private Room
            </button>
          </div>

         
        </div>
      </div>
  )
}
