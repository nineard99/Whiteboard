import { useEffect, useRef, useState } from "react";
import React from "react";

export function useCanvas(CANVAS_WIDTH: number, CANVAS_HEIGHT: number, GRID_SIZE: number) {
    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [color, setColor] = useState("black");
    const [postX, setPostX] = useState(0);
    const [postY, setPostY] = useState(0);
    const [opacity, setOpacity] = useState(5);
    const [showGrid, setShowGrid] = useState(false);
    const [isErasing, setIsErasing] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.lineWidth = opacity;
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                setContext(ctx);
            }
        }
        if (gridCanvasRef.current) {
            gridCanvasRef.current.width = CANVAS_WIDTH;
            gridCanvasRef.current.height = CANVAS_HEIGHT;
        }
    }, []);

    useEffect(() => {
        if (context) {
            context.lineWidth = opacity;
        }
    }, [opacity]);

    useEffect(() => {
        if (gridCanvasRef.current && showGrid) {
            drawGrid();
        } else if (gridCanvasRef.current) {
            const ctx = gridCanvasRef.current.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }, [showGrid]);

    function drawGrid() {
        if (!gridCanvasRef.current) return;
        const ctx = gridCanvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;

        for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }

        for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }
    }

    function draw(x: number, y: number) {
        if (!drawing || !context) return;
        context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
        context.beginPath();
        context.moveTo(postX, postY);
        context.lineTo(x, y);
        context.stroke();
        setPostX(x);
        setPostY(y);
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        setDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setPostX(e.clientX - rect.left);
        setPostY(e.clientY - rect.top);
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!drawing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        draw(e.clientX - rect.left, e.clientY - rect.top);
    }

    function handleTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
        setDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.touches[0];
        setPostX(touch.clientX - rect.left);
        setPostY(touch.clientY - rect.top);
    }

    function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
        if (!drawing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.touches[0];
        draw(touch.clientX - rect.left, touch.clientY - rect.top);
    }

    function changeColor(newColor: string) {
        setIsErasing(false);
        setColor(newColor);
        if (context) context.strokeStyle = newColor;
    }

    function useEraser() {
        setIsErasing(true);
    }

    function clearCanvas() {
        if (context) context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    return {
        canvasRef,
        gridCanvasRef,
        drawing,
        color,
        opacity,
        showGrid,
        isErasing,
        setOpacity,
        setShowGrid,
        handleMouseDown,
        handleMouseMove,
        handleTouchStart,
        handleTouchMove,
        changeColor,
        useEraser,
        clearCanvas,
        setDrawing,
    };
}
