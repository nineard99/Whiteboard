import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import React from "react";
import socket from "@/app/socket/socket";
type DrawData = {
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    isErasing: boolean;
    color: string;
    opacity: number;
};
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
    const { id: roomId } = useParams<{ id: string }>();




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
    }, [CANVAS_WIDTH, CANVAS_HEIGHT, opacity, color]);
    
    useEffect(() => {
        if (roomId) {
            socket.emit('joincanvas', roomId);
    
            socket.on("room_not_found", (room: string) => {
                alert(`Room ${room} does not exist.`);
            });
        }
    
        // Clean up เมื่อ component ถูก unmount
        return () => {
            socket.off("room_not_found");
            socket.off("disconnect");
        };
      }, [roomId]);

      useEffect(() => {
        if (!context) return; // รอให้ context ถูกตั้งค่าก่อน
    
        socket.on("loadCanvas", (savedDrawings: DrawData[]) => {
            console.log("Received draw data:", savedDrawings);
    
            savedDrawings.forEach(({ x, y, prevX, prevY, isErasing, color, opacity }) => {
                context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
                context.strokeStyle = color;
                context.lineWidth = opacity;
                context.beginPath();
                context.moveTo(prevX, prevY);
                context.lineTo(x, y);
                context.stroke();
            });
        });
    
        return () => {
            socket.off("loadCanvas");
        };
    }, [context]); // ให้ useEffect รอจนกว่าจะมี context
    
    
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
        
        // ส่งข้อมูลการวาดไปยังเซิร์ฟเวอร์
        socket.emit("draw", { roomId, x, y, prevX: postX, prevY: postY, isErasing, color, opacity });
    
        setPostX(x);
        setPostY(y);
    }

    
    useEffect(() => {
        socket.on("draw", ({ x, y, prevX, prevY, isErasing, color, opacity }) => {
            if (!context) return;
    
            // ตรวจสอบว่าห้องตรงกับ roomId ก่อน
                context.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
                context.strokeStyle = color;
                context.lineWidth = opacity; // ให้มั่นใจว่าฝั่งนี้ใช้ค่า opacity ที่สอดคล้องกัน
                context.beginPath();
                context.moveTo(prevX, prevY);
                context.lineTo(x, y);
                context.stroke();
          
        });
    
        return () => {
            socket.off("draw");
        };
    }, [context, roomId]);  // อัปเดต roomId เพื่อรับข้อมูลจากห้องที่ถูกต้อง
    
    
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
        socket.emit("clearCanvas",{roomId}); // แจ้งเซิร์ฟเวอร์ให้เคลียร์ทุกคน
    }
    useEffect(() => {
        socket.on("clearCanvas", () => {
            if (context) {
                context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        });
    
        return () => {
            socket.off("clearCanvas");
        };
    }, [context]);

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
