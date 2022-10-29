const UsersController = require("./users");
const authenticate = require("./auth");
const WorkspaceManager = require("./workspaces");
const TaskManager = require("./tasks");

module.exports = {
	UsersController,
	authenticate,
	TaskManager,
	WorkspaceManager,
};
