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
const logger = require("../utils/logger")(__filename);

class WorkspaceManager {
	constructor(workspaces) {
		this._workspaces = workspaces || [];
	}

	set = (workspaceList) => {
		this._workspaces = workspaceList;
	};

	add = async (username, workspaceData) => {
		const workspace = {
			id: workspaceData.id,
			name: workspaceData.name,
			owner: username,
			shared: workspaceData.shared || [],
		};
		this._workspaces.push(workspace);
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

	getByName = (workspaceName) => {
		return this._workspaces.find((w) => w.name === workspaceName);
	};

	delete = async (workspace) => {
		this._workspaces = this._workspaces.filter((w) => w.id !== workspace.id);
		logger.info(`Successfully deleted workspace: ${workspace.name}`);
		return workspace;
	};

	canAdd = (wName) => !this.getByName(wName);

	getAll = () => {
		return this._workspaces;
	};
}

const workspaceManager = new WorkspaceManager();

module.exports = workspaceManager;
