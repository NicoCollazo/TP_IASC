const ioClient = require("socket.io-client");
const logger = require("../utils/logger")(__filename);

const { UserDb, WorkspaceManager, TaskManager } = require("../models");

const serverName = process.env.SERVER_NAME || "SERVER_1";
const stateManagerPort = process.env.STATEMANAGER_PORT || "8090";

const base_service_URL =
	process.env.STATEMANAGER_SERVICE_URL ||
	process.env.BASE_URL ||
	"http://localhost";
const stateManagerURL = `${base_service_URL}:${stateManagerPort}`;

const initStateManagerSocketApp = (ioServer) => {
	const stateManagerSocket = ioClient.connect(stateManagerURL, {
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
	});

	stateManagerSocket.on("connect", () => {
		logger.info("Connected to the State Manager");
		stateManagerSocket.emit(
			"activeServer",
			serverName,
			(activeWorkspaces, activeTasks, activeUsers) => {
				WorkspaceManager.set(activeWorkspaces);
				TaskManager.set(activeTasks);
				UserDb.set(activeUsers);
			}
		);
	});

	stateManagerSocket.on("checkAddWorkspace", (workspace, ack) => {
		ack(WorkspaceManager.canAdd(workspace));
	});

	stateManagerSocket.on("commitAddWorkspace", ({ username, workspace }) => {
		logger.info(`Adding workspace ${workspace.id}`);
		WorkspaceManager.add(username, workspace).then((w) =>
			ioServer.emit("newWorkspace", w)
		);
	});

	stateManagerSocket.on("checkDeleteWorkspace", (workspace, ack) => {
		ack(WorkspaceManager.canDelete(workspace));
	});

	stateManagerSocket.on("commitDeleteWorkspace", ({ username, workspace }) => {
		logger.info(`Deleting workspace ${workspace.id}`);
		WorkspaceManager.delete(workspace).then((w) => {
			const workspaceTasks = TaskManager.get(w.name, username);
			TaskManager.delete(workspaceTasks.map((t) => t.id));
			ioServer.emit("deleteWorkspace", w);
			ioServer.in(w.id).socketsLeave(w.id);
		});
	});

	stateManagerSocket.on("checkAddTask", (task, ack) => {
		ack(TaskManager.canAdd(task));
	});

	stateManagerSocket.on("commitAddTask", ({ task, workspace }) => {
		logger.info(`Adding task ${task.id} in workspace ${workspace.id}`);
		TaskManager.add(task).then((updatedTask) =>
			ioServer.in(workspace.id).emit("newTask", updatedTask)
		);
	});

	stateManagerSocket.on("checkEditTask", (task, ack) => {
		ack(TaskManager.canEdit(task));
	});

	stateManagerSocket.on("commitEditTask", ({ task, workspace }) => {
		logger.info(`Editing task ${task.id} in workspace ${workspace.id}`);
		TaskManager.edit(task).then((editedTask) =>
			ioServer.in(workspace.id).emit("taskEdited", editedTask)
		);
	});

	stateManagerSocket.on("checkDeleteTask", (task, ack) => {
		ack(TaskManager.canDelete(task));
	});

	stateManagerSocket.on("commitDeleteTask", ({ task, workspace }) => {
		logger.info(`Deleted task ${task.id} in workspace ${workspace.id}`);
		TaskManager.delete(task).then(() =>
			ioServer.in(workspace.id).emit("taskDeleted", task)
		);
	});

	stateManagerSocket.on("disconnect", () => {
		logger.info("Disconnected from State Manager");
	});

	stateManagerSocket.io.on("reconnection_attempt", () => {
		logger.info("Attempting to reconnect to the State Manager...");
	});

	return stateManagerSocket;
};

module.exports = initStateManagerSocketApp;
