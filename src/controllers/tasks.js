const logger = require("../utils/logger")(__filename);

/* Schema:
	[
		{
			workspaceName: string,
			owner: string,
            tasks: [
				{	
					boardName: Literal(Todo, Doing, Done),
					id: string,
					content: string,
            		editing: boolean
				}
			],
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
		return "Task Added Successfully";
	};

	// Get all tasks related to a given workspace
	get = (workspaceName) => {
		let allTasks = this._tasks.filter(
			(task) => task.workspaceName === workspaceName
		);
		logger.info(allTasks);
		return allTasks;
	};

	// Get all the tasks ever created
	getAll = () => {
		return this._tasks;
	};
}

module.exports = TaskManager;
