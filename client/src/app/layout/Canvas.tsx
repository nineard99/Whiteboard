"use client"
import React from "react";
import Toolbar from "../components/toolbar";
import { useCanvas } from "../hooks/useCanvasSocket";

export default function Canvas() {
    const CANVAS_WIDTH = 1024;
    const CANVAS_HEIGHT = 868;
    const GRID_SIZE = 50;

    const {
   
        canvasRef,
        gridCanvasRef,
        handleTouchStart,
        handleTouchMove,
        color,
        opacity,
        showGrid,
        isErasing,
        setOpacity,
        setShowGrid,
        handleMouseDown,
        handleMouseMove,
        changeColor,
        useEraser,
        clearCanvas,
        setDrawing,
    } = useCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE);

    return (
        <div className="relative w-screen h-screen bg-gray-100 flex flex-col">
            {/* พื้นที่วาด */}
            
            <div className="flex-1 overflow-auto">
                <div className="relative w-[1024px] shadow-lg h-[868px] mx-auto">
                    <canvas 
                    className="absolute top-0 left-0 pointer-events-none" ref={gridCanvasRef} />
                    <canvas
                        className="border bg-white"
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={() => setDrawing(false)}
                        onMouseMove={handleMouseMove}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => setDrawing(false)}
                    />

                </div>
            </div>
            <Toolbar 
                clearCanvas={clearCanvas}
                useEraser={useEraser}
                changeColor={changeColor}
                setShowGrid={setShowGrid}
                setOpacity={setOpacity}
                isErasing={isErasing}
                showGrid={showGrid}
                color={color}
                opacity={opacity}
            />

        </div>
    );
}
