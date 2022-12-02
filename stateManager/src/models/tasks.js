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

	// Add a new task to the list
	add = async (task) => {
		this._tasks.push(task);
		return task;
	};

	// Get all tasks related to a given workspace
	get = (workspaceName) => {
		let allTasks = this._tasks.filter(
			(task) => task.workspaceName === workspaceName
		);
		logger.info(JSON.stringify(allTasks));
		return allTasks;
	};

	set = (tasks) => {
		this._tasks = tasks;
	};

	getTaskIndex = (taskId) => {
		return this._tasks.findIndex((t) => t.id === taskId);
	};

	edit = async (newTaskData) => {
		const idx = this.getTaskIndex(newTaskData.id);
		this._tasks[idx] = newTaskData;
		return newTaskData;
	};

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

	// Get all the tasks ever created
	getAll = () => {
		return this._tasks;
	};
}

const taskManager = new TaskManager();

module.exports = taskManager;
