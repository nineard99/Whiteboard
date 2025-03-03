'use client'
import React, { useState } from 'react'

import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import JoinRoom from './components/joinroom';
import Orb from './components/reactbitHomebg';
import { Home } from './layout/home';
import socket from "@/app/socket/socket";


const generateRandomRoomId = () => {
  return uuidv4();
}

const Page = () => {
  const router = useRouter();
  const [roomState, setRoomState] = useState<'default' | 'join' >('default');

  const handleCreateRoom = () => {
    const newRoomId = generateRandomRoomId();
    socket.emit('create_room', newRoomId);
    router.push(`/canvas/${newRoomId}`); 
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <Orb
        hoverIntensity={0.5}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">

      {/* Overlay for better text readability */}
      {roomState === 'join' ? (
        <JoinRoom onBack={() => setRoomState('default')} />
      ):(
        <Home createRoom={() => handleCreateRoom()} joinRoom={() => setRoomState('join')}/>
      )
      }
      </div>
    </div>
  );
};

export default Page;
