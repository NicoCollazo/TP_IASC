const { Router } = require("express");

const { UserDb } = require("../models");
const { authRouter, usersRouter } = require("../routers");
const logger = require("../utils/logger")(__filename);
const { verifyTokenSocket } = require("../middlewares");
const initStateManagerSocketApp = require("./stateManagerApp");
const { WorkspacesController, TasksController } = require("../controllers");

const router = Router();
const DEBUG = process.env.DEBUG || false;

const initApp = (io, expressApp) => {
	const stateManagerSocket = initStateManagerSocketApp(io);
	const tasksController = new TasksController();
	const workspacesController = new WorkspacesController();

	authRouter(router);
	usersRouter(router, stateManagerSocket);
	expressApp.use("/api", router);

	io.use((s, next) => verifyTokenSocket(UserDb, s, next));
	io.on("connection", (socket) => {
		logger.info(`User ${socket.user.username} connected`);
		// Join a room for the user.
		socket.join(socket.user.username);
		socket.on("getAllWorkspaces", () =>
			workspacesController.allWorkspaces(socket)
		);

		socket.on("openWorkspace", (workspaceName) =>
			workspacesController.openWorkspace(socket, io, workspaceName)
		);

		socket.on("addWorkspace", (workspace, ack) => {
			workspacesController.addWorkspace(
				socket,
				stateManagerSocket,
				workspace,
				ack
			);
		});

		socket.on("deleteWorkspace", (workspace, ack) => {
			workspacesController.deleteWorkspace(socket, workspace, ack);
		});

		socket.on("addTask", (task, ack) =>
			tasksController.addTask(socket, stateManagerSocket, task, ack)
		);

		socket.on("editTask", (task, ack) =>
			tasksController.editTask(socket, stateManagerSocket, task, ack)
		);

		socket.on("deleteTask", (task, ack) =>
			tasksController.deleteTask(socket, stateManagerSocket, task, ack)
		);

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
};

module.exports = initApp;
