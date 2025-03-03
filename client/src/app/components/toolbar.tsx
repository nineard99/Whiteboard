"use client"
import React from "react";
import { Eraser, Grid, Pencil, Trash, Palette } from "lucide-react";

interface ToolbarProps {
    clearCanvas: () => void;
    useEraser: () => void;
    changeColor: (color: string) => void;
    setShowGrid: (show: boolean) => void;
    setOpacity: (opacity: number) => void;
    isErasing: boolean;
    showGrid: boolean;
    color: string;
    opacity: number;
}

export default function Toolbar({
    clearCanvas,
    useEraser,
    changeColor,
    setShowGrid,
    setOpacity,
    isErasing,
    showGrid,
    color,
    opacity,
}: ToolbarProps) {
    return (
        <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4">
            <div className="flex flex-col gap-3">
                <button
                    onClick={clearCanvas}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Clear Canvas"
                >
                    <Trash className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                <button
                    onClick={useEraser}
                    className={`p-2 rounded-lg transition-colors ${
                        isErasing
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title="Eraser"
                >
                    <Eraser className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                <button
                    onClick={() => changeColor("black")}
                    className={`p-2 rounded-lg transition-colors ${
                        !isErasing
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title="Brush"
                >
                    <Pencil className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 rounded-lg transition-colors ${
                        showGrid
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title="Toggle Grid"
                >
                    <Grid className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                    
                <div className="relative group">
                    <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Color Picker"
                    >
                        <Palette className="w-6 h-6" style={{ color }} />
                    </button>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => changeColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                
                <div className="px-2">
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={opacity}
                            onChange={(e) => setOpacity(Number(e.target.value))}
                            className="w-full accent-blue-500"
                            title="Brush Size"
                        />
                </div>
            </div>
        </div>
    );
}
