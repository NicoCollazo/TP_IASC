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

const getAllLocalhostPorts = () => {
  var origins = [];
  for (var i = 0; i <= 65536; i++) {
    origins.push(`http://127.0.0.1:${i.toString()}`);
  }
  return origins;
};

const origins =
  process.env.NODE_ENV === "development" ? [frontURL] : getAllLocalhostPorts();
// Api Configuration.
app.set("json spaces", 4);
app.use(express.json());
app.use(cors({ origin: origins, credentials: true }));
app.listen(apiPort);

// Socket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: origins, credentials: true },
  transports: ["websocket"],
});
server.listen(ioPort);

healthCheck();
initApp(io, app);

module.exports = app;
