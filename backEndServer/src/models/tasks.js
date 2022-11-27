const logger = require("../utils/logger")(__filename);

/* Schema:
	[
		{	
			board: Literal(Todo, Doing, Done),
			workspaceName: string,
			owner: string,
			id: string,
			content: string,
			editing: boolean
		}
	]
*/
class TaskManager {
	constructor(tasks) {
		// To locally hold the list of all created tasks
		this._tasks = tasks || [];
	}

	set = (tasks) => {
		this._tasks = tasks;
	};

	// Add a new task to the list
	add = async (task) => {
		this._tasks.push(task);
		return task;
	};

	canAdd = (task) => !this._taskExists(task);

	// Get all tasks related to a given workspace
	get = (workspaceName, owner) => {
		let allTasks = this._tasks.filter(
			(task) => task.workspaceName === workspaceName && task.owner === owner
		);
		logger.info(JSON.stringify(allTasks));
		return allTasks;
	};

	_taskExists = (task) => this._tasks.map((t) => t.id).includes(task.id);

	getTaskIndex = (taskId) => {
		return this._tasks.findIndex((t) => t.id === taskId);
	};

	edit = async (newTaskData) => {
		const idx = this.getTaskIndex(newTaskData.id);
		this._tasks[idx] = newTaskData;
		return newTaskData;
	};

	canEdit = (task) => this._taskExists(task);

	_deleteOne = async (taskId) => {
		const idx = this.getTaskIndex(taskId);
		try {
			this._tasks.splice(idx, 1);
		} catch (err) {
			logger.error(`Failed to delete task ${taskId}`);
			throw err;
		}
	};

	_deleteMany = async (taskIds) => {
		taskIds.forEach((taskId) => {
			this.delete(taskId);
		});
	};

	delete = async (param) => {
		if (Array.isArray(param)) {
			await this._deleteMany(param);
		} else {
			await this._deleteOne(param);
		}
	};

	canDelete = (task) => this._taskExists(task);

	// Get all the tasks ever created
	getAll = () => {
		return this._tasks;
	};
}

const taskManager = new TaskManager();

module.exports = taskManager;
