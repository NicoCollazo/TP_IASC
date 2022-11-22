const logger = require("../utils/logger")(__filename);
const { WorkspaceManager, TaskManager } = require("../models");

class TasksController {
	addTask = (socket, task, ack) => {
		const workspace = WorkspaceManager.getByName(
			socket.user.username,
			task.workspaceName
		);
		const updatedTask = TaskManager.add({
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
	};

	editTask = (socket, task, ack) => {
		const workspace = WorkspaceManager.getByName(
			socket.user.username,
			task.workspaceName
		);
		const updatedTask = TaskManager.edit(task);
		logger.info(`Editing task ${updatedTask.id} on workspace ${workspace.id}`);
		// Broadcast to all other nodes.
		socket.to(workspace.id).emit("taskEdited", updatedTask);
		// Responde to sender node.
		ack(updatedTask);
	};

	deleteTask = (socket, task, ack) => {
		const workspace = WorkspaceManager.getByName(
			socket.user.username,
			task.workspaceName
		);
		try {
			TaskManager.delete(task.id);
			logger.info(`Deleted task ${task.id} on workspace ${workspace.id}`);
			socket.to(workspace.id).emit("taskDeleted", task);
			ack(task);
		} catch (err) {
			logger.error({
				message: `An error has occurred trying to delete task ${task.id}`,
				trace: err.message,
			});
		}
	};
}

module.exports = TasksController;
