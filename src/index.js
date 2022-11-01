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
		content: "Hola, soy una tarea",
		editing: false,
	},
];

const workspaceManagerInstance = new WorkspaceManager(test_workspaces);
const tasksManagerInstance = new TaskManager(test_tasks);

setInterval(
	() => logger.info("Tasks: " + JSON.stringify(tasksManagerInstance._tasks)),
	3000
);

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

		// All subsequest emmision happen in the room.
		const updated_tasks = tasksManagerInstance.get(
			workspace.name,
			socket.user.username
		);
		io.in(workspace.id).emit("allTasks", updated_tasks);
	});

	socket.on("addTask", (task) => {
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
		io.in(workspace.id).emit("newTask", updatedTask);
	});

	socket.on("editTask", (task) => {
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
		io.in(workspace.id).emit("taskEdited", updatedTask);
	});

	//TODO: Handle task and workspace deletion.
	// socket.on("deleteTask")

	//TODO: Handle task and workspace deletion.
	// socket.on("deleteWorkspace")

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
