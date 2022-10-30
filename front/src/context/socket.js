import socketio from "socket.io-client";
import React from "react";

export const socket = socketio.connect("http://localhost:8081", { secure: true });
export const SocketContext = React.createContext();
