const http = require("http");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
dotenv.config();

const logger = require("./utils/logger")(__filename);

const port = process.env.PORT || "8082";
const serversURL = "http://localhost:8080";
const frontURL = "http://localhost:3001";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: [serversURL, frontURL], credentials: true },
});
server.listen(port);

io.on("connection", (socket) => {
	logger.info("Received a new connection");

	socket.on("status", (serviceStatus) => {
		logger.info(serviceStatus);
		socket.broadcast.emit("publishStatus", serviceStatus);
	});

	setInterval(() => {
		socket.emit("getStatus");
	}, 6000);
});
