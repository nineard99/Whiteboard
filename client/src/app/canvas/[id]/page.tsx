'use client'
import Orb from '@/app/components/reactbitHomebg';
import Room from '@/app/components/room';
import Canvas from '@/app/layout/Canvas';
import React, { useEffect } from 'react'
import { useState } from "react";



const Page  = () => {
  const [gameStart,setGameStart] = useState(false)

  

  return (
    <div>
      {!gameStart ? (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <Room onStart={() => setGameStart(true)} />
          </div>
        </div>
      ):(
        <Canvas />
      )
      }
      

    </div>
    
  );
};

export default Page;
