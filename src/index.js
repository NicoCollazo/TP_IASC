const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
dotenv.config();

const router = require("./routers");
const { initApi, initSocketApp, healthCheck } = require("./server");

const app = express();
const apiPort = process.env.PORT || "8080";
const ioPort = process.env.IO_PORT || "8081";
const frontPort = process.env.FRONT_PORT || "3000";
const baseURL = "http://localhost";
const frontURL = `${baseURL}:${frontPort}`;

// Api
initApi(app);
app.use(cors({ origin: frontURL, credentials: true }));
app.use("/api", router);
app.listen(apiPort);

// Socket Server
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: frontURL, credentials: true },
});
server.listen(ioPort);

healthCheck();
initSocketApp(io);

module.exports = app;
