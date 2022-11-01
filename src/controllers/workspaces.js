/* Schema:
	[
		{
			id: string,
			name: string,
			owner: string,
			shared: [string] (allowed usernames)
		}
	]
*/
const { v4: uuidv4 } = require("uuid");

const logger = require("../utils/logger")(__filename);

class WorkspaceManager {
	constructor(workspaces) {
		this._workspaces = workspaces || [];
	}

	set = (workspaceList) => {
		this._workspaces = workspaceList;
	};

	add = async (username, workspaceName) => {
		const workspace = {
			id: uuidv4(),
			name: workspaceName,
			owner: username,
			shared: [],
		};
		this._workspaces.push(workspace);
		logger.info("Addition Successfull");
		return workspace;
	};

	_getSharedWorkspaces = (username) => {
		return this._workspaces.filter((w) => w.shared.includes(username));
	};

	getByUsername = (username) => {
		return [
			// Workspaces the user owns.
			...this._workspaces.filter((w) => username === w.owner),
			// Workspaces shared to the user.
			...this._getSharedWorkspaces(username),
		].sort();
	};

	getByName = (username, workspaceName) => {
		return this.getByUsername(username).find((w) => w.name === workspaceName);
	};

	getAll = () => {
		return this._workspaces;
	};
}

module.exports = WorkspaceManager;
