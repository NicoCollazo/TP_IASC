const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");

const router = require("./routers");
const { initApp } = require("./server");
const { verifyTokenSocket } = require("./middlewares");
const logger = require("./utils/logger")(__filename);
dotenv.config();

const app = express();
const io_port = process.env.IO_PORT || "8081";
const api_port = process.env.PORT || "8080";

initApp(app);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/api", router);
app.listen(api_port);

const server = http.createServer(app);

const io = new Server(server, {
	cors: { origin: "http://localhost:3000", credentials: true },
});
server.listen(io_port);

const { WorkspaceManager, TaskManager } = require("./controllers");
const test_workspaces = [
	{
		name: "test",
		owner: "Jorge",
		shared: ["Ramiro"],
	},
	{
		name: "test2",
		owner: "Ramiro",
		shared: [],
	},
];

const workspaceManagerInstance = new WorkspaceManager(test_workspaces);
const tasksManagerInstance = new TaskManager();

// Initializing the socket io connection
io.use(verifyTokenSocket);
io.on("connection", (socket) => {
	socket.on("allWorkspaces", () => {
		logger.info(`User ${socket.user.username} connected`);
		const user_workspaces = workspaceManagerInstance.getByUsername(
			socket.user.username
		);
		io.emit("allWorkspaces", user_workspaces);
	});

	socket.on("openWorkspace", (workspace) => {
		logger.info(`Joining workspace ${workspace.name}`);

		// Create a new room with the workspace name
		socket.join(workspace.name);

		// All subsequest emmision happen in the room.
		const updated_tasks = tasksManagerInstance.get(workspace.name);
		io.in(workspace.name).emit("allTasks", updated_tasks);
	});

	// Endpoint for adding new Task
	socket.on("addTask", (task) => {
		logger.info(`Adding task ${JSON.stringify(task)}`);
		tasksManagerInstance.add(task);
		io.in(task.workspaceName).emit("newTask", { task });
	});

	// Endpoint for adding new Workspace
	socket.on("addWorkspace", (workspace) => {
		logger.info(`Adding Workspace ${JSON.stringify(workspace)}`);
		workspaceManagerInstance
			.add(socket.user.username, workspace)
			.then((w) => io.emit("newWorkspace", w));
	});

	socket.on("disconnect", () => {
		logger.info(`User ${socket.user.username} disconnected`);
	});
});

module.exports = app;
