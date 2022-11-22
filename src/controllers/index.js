const authenticate = require("./auth");
const TasksController = require("./tasks");
const UsersController = require("./users");
const WorkspacesController = require("./workspaces");

module.exports = {
	authenticate,
	TasksController,
	UsersController,
	WorkspacesController,
};
