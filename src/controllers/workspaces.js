/* Schema:
	[
		{
			name: string,
			owner: string,
			shared: [string] (allowed usernames)
		}
	]
*/
class WorkspaceManager {
	constructor(workspaces) {
		this._workspaces = workspaces || [];
	}

	set = (workspaceList) => {
		this._workspaces = workspaceList;
	};

	add = (username, workspace) => {
		this._workspaces.push({ name: workspace, owner: username, shared: [] });
		return "Addition Successfull";
	};

	getByUsername = (username) => {
		return this._workspaces.filter((w) => username === w.owner);
	};

	getAll = () => {
		return this._workspaces;
	};
}

module.exports = WorkspaceManager;
