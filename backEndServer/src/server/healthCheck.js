const ioClient = require("socket.io-client");

const logger = require("../utils/logger")(__filename);
const { TaskManager, WorkspaceManager } = require("../models");

const port = process.env.MONITORING_PORT || 8082;
const serverName = process.env.SERVER_NAME || "SERVER_1";
const performHealthCheck = process.env.HEALTHCHECK || false;
const baseURL = process.env.MONITOR_URL || "http://localhost";
const monitoringServiceURL = `${baseURL}:${port}`;

const healthCheck = () => {
	// Only connect if specified.
	if (!performHealthCheck) return;

	const socket = ioClient.connect(monitoringServiceURL, {
		reconnection: true,
	});
	socket.on("connect", () => {
		logger.info("Connected to monitoring service.");
	});

	socket.on("getStatus", () => {
		const tasksStatus = "Tasks: " + JSON.stringify(TaskManager.getAll());
		const workspacesStatus =
			"Workspaces: " + JSON.stringify(WorkspaceManager.getAll());
		socket.emit("status", {
			name: serverName,
			workspaces: workspacesStatus,
			tasks: tasksStatus,
		});
	});

	socket.on("disconnect", () => {
		logger.info("Disconnected from monitoring service.");
	});
};

module.exports = healthCheck;
