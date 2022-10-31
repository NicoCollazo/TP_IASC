import socketio from "socket.io-client";
import React from "react";

const SOCKET_URL = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SOCKET_PORT}`;

export const socket = socketio(SOCKET_URL, {
	withCredentials: true,
});
export const SocketContext = React.createContext();
