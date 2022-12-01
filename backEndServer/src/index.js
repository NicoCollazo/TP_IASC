const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
dotenv.config();

const { initApp, healthCheck } = require("./server");

const app = express();
const apiPort = process.env.PORT || "8080";
const ioPort = process.env.IO_PORT || "8081";
const frontPort = process.env.FRONT_PORT || "3000";
const baseURL = process.env.FRONT_SERVICE_URL || "http://localhost";
const frontURL = `${baseURL}:${frontPort}`;

// Api Configuration.
app.set("json spaces", 4);
app.use(express.json());
app.use(cors({ origin: frontURL, credentials: true }));
app.listen(apiPort);

// Socket Server
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: frontURL, credentials: true },
});
server.listen(ioPort);

healthCheck();
initApp(io, app);

module.exports = app;
