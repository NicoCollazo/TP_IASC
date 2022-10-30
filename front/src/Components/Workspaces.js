import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { SocketContext } from "../context/socket";

const Workspaces = ({ userToken }) => {
	const socket = useContext(SocketContext);
	const [workspaceList, setWorkspaceList] = useState([]);

	// Load the list of previously created workspaces once during the first rendering
	useEffect(() => {
		socket.emit("login");
		socket.on("allWorkspaces", (workspaces) => {
			setWorkspaceList(workspaces);
		});
	}, []);

	// Keep listening for New Workspaces that might be created by other users in the organization
	useEffect(() => {
		const wplistener = ({ workspace }) => {
			setWorkspaceList((oldList) => [...oldList, workspace]);
		};
		socket.on("newWorkspace", wplistener);
		return () => socket.off("newWorkspace", wplistener);
	});

	return (
		<>
			<p>Select a Workspace</p>
			<div>
				{workspaceList.map((w) => (
					<Link to={`${w.name}`}>{w.name}</Link>
				))}
			</div>
			<p>Create a Workspace</p>
			{/* TODO: Handle Creation. */}
		</>
	);
};

export default Workspaces;
