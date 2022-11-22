const ioClient = require("socket.io-client");
const logger = require("../utils/logger")(__filename);

const { UserDb, WorkspaceManager, TaskManager } = require("../models");
const workspaceManager = require("../models/workspaces");

const serverName = process.env.SERVER_NAME || "SERVER_1";
const stateManagerPort = process.env.STATEMANAGER_PORT || "8090";

const baseURL = "http://localhost";
const stateManagerURL = `${baseURL}:${stateManagerPort}`;

const initStateManagerSocketApp = () => {
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
		workspaceManager.add(username, workspace);
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
