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
	add = (task) => {
		this._tasks.push(task);
		return task;
	};

	// Get all tasks related to a given workspace
	get = (workspaceName, owner) => {
		let allTasks = this._tasks.filter(
			(task) => task.workspaceName === workspaceName && task.owner === owner
		);
		logger.info(JSON.stringify(allTasks));
		return allTasks;
	};

	getTaskIndex = (taskId) => {
		return this._tasks.findIndex((t) => t.id === taskId);
	};

	edit = (workspaceName, owner, newTaskData) => {
		const idx = this.getTaskIndex(newTaskData.id);
		this._tasks[idx] = newTaskData;
		return newTaskData;
	};

	// Get all the tasks ever created
	getAll = () => {
		return this._tasks;
	};
}

module.exports = TaskManager;
