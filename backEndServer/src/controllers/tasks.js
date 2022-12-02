const logger = require("../utils/logger")(__filename);
const BaseController = require("./base");
const { WorkspaceManager, TaskManager } = require("../models");

class TasksController extends BaseController {
	addTask = async (socket, stateManagerSocket, task, ack) => {
		const workspace = WorkspaceManager.getByName(task.workspaceName);

		this._promiseEmitWithTimeout(
			stateManagerSocket.emit.bind(stateManagerSocket),
			"attemptToAddTask",
			{ task: { ...task, owner: socket.user.username }, workspace }
		)
			.then((acceptedTask) => {
				TaskManager.add(acceptedTask).then((t) => {
					logger.info(`Adding task ${t.id} to workspace ${workspace.id}`);
					socket.to(workspace.id).emit("newTask", t);
					ack(t);
				});
			})
			.catch((err) => {
				ack({ error: err });
			});
	};

	editTask = (socket, stateManagerSocket, task, ack) => {
		const workspace = WorkspaceManager.getByName(task.workspaceName);

		this._promiseEmitWithTimeout(
			stateManagerSocket.emit.bind(stateManagerSocket),
			"attemptToEditTask",
			{ task, workspace }
		)
			.then((acceptedTask) => {
				TaskManager.edit(acceptedTask).then((t) => {
					logger.info(`Editing task ${t.id} on workspace ${workspace.id}`);
					socket.to(workspace.id).emit("taskEdited", t);
					ack(t);
				});
			})
			.catch((err) => {
				ack({ error: err });
			});
	};

	deleteTask = (socket, stateManagerSocket, task, ack) => {
		const workspace = WorkspaceManager.getByName(task.workspaceName);
		this._promiseEmitWithTimeout(
			stateManagerSocket.emit.bind(stateManagerSocket),
			"attemptToDeleteTask",
			{ task, workspace }
		)
			.then((deletedTask) => {
				TaskManager.delete(deletedTask).then(() => {
					logger.info(
						`Deleted task ${deletedTask.id} in workspace ${workspace.id}`
					);
					socket.to(workspace.id).emit("taskDeleted", deletedTask);
					ack(deletedTask);
				});
			})
			.catch((err) => {
				ack({ error: err });
			});
	};
}

module.exports = TasksController;
