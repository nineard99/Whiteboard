import { io } from "socket.io-client";

const socket = io("http://10.5.159.190:4000", {
    transports: ["websocket", "polling"],
});

export default socket;
