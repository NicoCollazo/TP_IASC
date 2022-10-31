import socketio from "socket.io-client";
import React from "react";

export const socket = socketio.connect("http://localhost:8081", {
	withCredentials: true,
});
export const SocketContext = React.createContext();
