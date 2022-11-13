const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");
const ioClient = require("socket.io-client");

const router = require("./routers");
const { initApp } = require("./server");
const { verifyTokenSocket } = require("./middlewares");
const logger = require("./utils/logger")(__filename);
dotenv.config();

const app = express();
const DEBUG = process.env.DEBUG || false;
const name = process.env.NAME || "SERVER_1";
const apiPort = process.env.PORT || "8080";
const ioPort = process.env.IO_PORT || "8081";
const stateManagerPort = process.env.STATEMANAGER_PORT || "8090";
const frontPort = process.env.FRONT_PORT || "3000";
const monitoringPort = process.env.MONITORING_PORT || "8082";
const performHealthCheck = process.env.HEALTHCHECK || false;
const baseURL = "http://localhost";
const frontURL = `${baseURL}:${frontPort}`;
const monitoringServiceURL = `${baseURL}:${monitoringPort}`;

/* ------ APP INITIALIZATION ------ */
initApp(app);
app.use(cors({ origin: frontURL, credentials: true }));
app.use("/api", router);
app.listen(apiPort);

const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: frontURL, credentials: true },
});
server.listen(ioPort);

const { WorkspaceManager, TaskManager } = require("./controllers");
const test_workspaces = [
	{
		id: "123123123",
		name: "test",
		owner: "Jorge",
		shared: ["Ramiro"],
	},
	{
		id: "123123124",
		name: "test2",
		owner: "Ramiro",
		shared: [],
	},
];

const test_tasks = [
	{
		board: "Doing",
		workspaceName: "test2",
		owner: "Ramiro",
		id: "1231231231",
		title: "Hola, soy una tarea",
		content: "",
		editing: false,
	},
];

const workspaceManagerInstance = new WorkspaceManager(test_workspaces);
const tasksManagerInstance = new TaskManager(test_tasks);
/* -------------------------------- */

/* ------ HEALTHCHECK ------ */
if (performHealthCheck) {
	const socket = ioClient.connect(monitoringServiceURL, {
		reconnection: true,
	});
	socket.on("connect", () => {
		logger.info("Connected to monitoring service.");
	});

	socket.on("getStatus", () => {
		const tasksStatus = "Tasks: " + JSON.stringify(tasksManagerInstance._tasks);
		const workspacesStatus =
			"Workspaces: " + JSON.stringify(workspaceManagerInstance._workspaces);
		socket.emit("status", {
			name,
			workspaces: workspacesStatus,
			tasks: tasksStatus,
		});
	});
}
/* ------------------------- */

/* ------ SOCKET SERVER ------ */
io.use(verifyTokenSocket);
io.on("connection", (socket) => {
	socket.on("allWorkspaces", () => {
		logger.info(`User ${socket.user.username} connected`);
		const user_workspaces = workspaceManagerInstance.getByUsername(
			socket.user.username
		);
		io.emit("allWorkspaces", user_workspaces);
	});

	socket.on("openWorkspace", (workspaceName) => {
		const workspace = workspaceManagerInstance.getByName(
			socket.user.username,
			workspaceName
		);
		logger.info(
			`${socket.user.username} is joining workspace ${workspace.name}`
		);

		// Create a new room with the workspace
		socket.join(workspace.id);

		// All subsequest emmisions happen in the room.
		const updated_tasks = tasksManagerInstance.get(
			workspace.name,
			socket.user.username
		);
		io.in(workspace.id).emit("allTasks", updated_tasks);
	});

	socket.on("addWorkspace", (workspace, ack) => {
		logger.info(`Adding Workspace ${JSON.stringify(workspace)}`);
		workspaceManagerInstance.add(socket.user.username, workspace).then((w) => {
			socket.broadcast.emit("newWorkspace", w);
			ack(w);
		});
	});

	socket.on("deleteWorkspace", (workspace, ack) => {
		workspaceManagerInstance.delete(workspace).then((w) => {
			socket.broadcast.emit("deleteWorkspace", w);
			ack(w);
			socket.leave(workspace.id);
		});
		// TODO: Delete all tasks related to that workspace here
		// and emit an event to let the user know that the workspace
		// doesn't exist anymore.
	});

	socket.on("addTask", (task, ack) => {
		const workspace = workspaceManagerInstance.getByName(
			socket.user.username,
			task.workspaceName
		);
		const updatedTask = tasksManagerInstance.add({
			...task,
			owner: socket.user.username,
		});
		logger.info(
			`Adding task ${JSON.stringify(updatedTask)} to workspace ${workspace.id}`
		);
		// Broadcast the task to the other nodes.
		socket.to(workspace.id).emit("newTask", updatedTask);
		// ACK to the specific node.
		ack(updatedTask);
	});

	socket.on("editTask", (task, ack) => {
		const workspace = workspaceManagerInstance.getByName(
			socket.user.username,
			task.workspaceName
		);
		const updatedTask = tasksManagerInstance.edit(
			task.workspacename,
			socket.user.username,
			task
		);
		logger.info(`Editing task ${updatedTask.id} on workspace ${workspace.id}`);
		// Broadcast to all other nodes.
		socket.to(workspace.id).emit("taskEdited", updatedTask);
		// Responde to sender node.
		ack(updatedTask);
	});

	//TODO: Handle task deletion.
	// socket.on("deleteTask")

	socket.on("disconnect", () => {
		logger.info(`User ${socket.user.username} disconnected`);
	});

	// DEBUG ROOMS.
	if (DEBUG) {
		io.of("/").adapter.on("join-room", (room, id) => {
			logger.info(`socket ${id} has joined room ${room}`);
		});
	}
});
/* --------------------------- */

module.exports = app;
