import React from "react";
import socketio from "socket.io-client";

const SOCKET_URL = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SOCKET_PORT}`;

export const socket = socketio(SOCKET_URL, {
	withCredentials: true,
});
export const SocketContext = React.createContext();
