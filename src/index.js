const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");

const getLogger = require("./utils/logger");
const logger = getLogger(__filename);
dotenv.config();

const app = express();
const io_port = process.env.IO_PORT || "8081";

app.use(cors());
const server = http.createServer(app, {
	cors: {
		origin: '*',
		withCredentials: true,
	}
});
const io = new Server(server);

// Initialize Socket Server.
server.listen(io_port);
const { WorkspaceManager, TaskManager } = require("./controllers");

const workspaceManagerInstance = new WorkspaceManager([{
	name: "test",
	owner: "Ramiro",
	shared: []
}]);
const tasksManagerInstance = new TaskManager();

// Initializing the socket io connection
io.on("connection", (socket) => {
	socket.on("login", () => {
		logger.info("new login");
		// Returns list of all workspaces within the organization
		io.emit("allWorkspaces", workspaceManagerInstance.getAll());
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
		workspaceManagerInstance.add(workspace);
		io.emit("newWorkspace", { workspace });
	});

	socket.on("disconnect", () => {
		logger.info("User disconnected");
	});
});

module.exports = app;
