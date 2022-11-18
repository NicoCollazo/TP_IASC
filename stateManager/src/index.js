const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();

const app = express(cors("*"));

const port = process.env.PORT || "8090";

const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "*", credentials: true },
});
server.listen(port);

const activeServers = [];

io.on("connection", (socket) => {
	socket.on("activeServer", (serverName) => {
		if (!activeServers.some((s) => s.name === serverName)) {
			activeServers.push({ name: serverName, socket });
		}
	});

	socket.on("attemptToAddWorkspace", (workspace) => {
		// Checks if all nodes can add the workspace.
		io.emit("checkAddWorkspace", workspace);
	});

	socket.on("ACKcheckAddWorkspace", (workspace) => {
		// ACK all nodes can add the workspace.
		io.emit("commitAddWorkspace", workspace);
	});
});
