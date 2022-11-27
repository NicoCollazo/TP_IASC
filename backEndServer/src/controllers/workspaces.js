const logger = require("../utils/logger")(__filename);
const BaseController = require("./base");
const { WorkspaceManager, TaskManager } = require("../models");

class WorkspacesController extends BaseController {
	allWorkspaces = (socket, io) => {
		logger.info(`User ${socket.user.username} connected`);
		const user_workspaces = WorkspaceManager.getByUsername(
			socket.user.username
		);
		io.emit("allWorkspaces", user_workspaces);
	};

	openWorkspace = (socket, io, workspaceName) => {
		const workspace = WorkspaceManager.getByName(
			socket.user.username,
			workspaceName
		);
		logger.info(
			`${socket.user.username} is joining workspace ${workspace.name}`
		);

		// Create a new room with the workspace
		socket.join(workspace.id);

		// All subsequest emmisions happen in the room.
		const updated_tasks = TaskManager.get(workspace.name, socket.user.username);
		io.in(workspace.id).emit("allTasks", updated_tasks);
	};

	addWorkspace = (socket, stateManagerSocket, workspace, ack) => {
		logger.info(
			`User ${
				socket.user.username
			} is attempting to create a Workspace named: ${JSON.stringify(workspace)}`
		);
		this._promiseEmitWithTimeout(
			stateManagerSocket.emit.bind(stateManagerSocket),
			"attemptToAddWorkspace",
			{
				workspace,
				username: socket.user.username,
			}
		)
			.then((workspace) => {
				WorkspaceManager.add(socket.user.username, workspace).then((w) => {
					socket.broadcast.emit("newWorkspace", w);
					ack(w);
				});
			})
			.catch((err) => {
				logger.error(err);
			});
	};

	deleteWorkspace = (socket, workspace, ack) => {
		logger.info(
			`User ${
				socket.user.username
			} is attempting to delete a Workspace named: ${JSON.stringify(workspace)}`
		);
		this._promiseEmitWithTimeout(
			stateManagerSocket.emit.bind(stateManagerSocket),
			"attemptToDeleteWorkspace",
			{ workspace, username: socket.user.username }
		)
			.then((workspace) => {
				WorkspaceManager.delete(workspace).then((w) => {
					const workspaceTasks = TaskManager.get(w.name, socket.user.username);
					TaskManager.delete(workspaceTasks.map((t) => t.id));
					ioServer.in(w.id).socketsLeave(w.id);
					io.emit("deleteWorkspace", w);
					ack(w);
				});
			})
			.catch((err) => {
				logger.error(err);
			});
	};
}

module.exports = WorkspacesController;
