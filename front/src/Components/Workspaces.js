import { useContext, useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { Link } from "react-router-dom";

import { SocketContext } from "../context/socket";
const socket_url = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SOCKET_PORT}`;

const Workspaces = () => {
	const socket = useContext(SocketContext);
	const [workspaceList, setWorkspaceList] = useState([]);

	// Load the list of previously created workspaces once during the first rendering
	useEffect(() => {
		// Force Reconnect to validate the auth_token.
		socket.disconnect().connect(socket_url, {
			withCredentials: true,
			forceNew: true,
		});

		socket.emit("allWorkspaces");
		socket.on("allWorkspaces", (workspaces) => {
			setWorkspaceList(workspaces);
		});
	}, []);

	// Keep listening for New Workspaces that might be created by other users in the organization
	useEffect(() => {
		const wplistener = (workspace) => {
			setWorkspaceList((oldList) => [...oldList, workspace]);
		};
		socket.on("newWorkspace", wplistener);
		return () => socket.off("newWorkspace", wplistener);
	});

	return (
		<>
			<p>Select a Workspace</p>
			<div>
				{workspaceList.map((w, idx) => (
					<button key={`workspace_${idx}`}>
						<Link to={`${w.name}`}>{w.name}</Link>
					</button>
				))}
			</div>
			<p>Create a Workspace</p>
			<Formik
				initialValues={{
					workspaceName: "",
				}}
				onSubmit={async (values) => {
					socket.emit("addWorkspace", values.workspaceName);
				}}
			>
				<Form>
					<label htmlFor="workspaceName">Workspace Name</label>
					<Field
						id="workspaceName"
						name="workspaceName"
						placeholder="Test Workspace"
					/>
					<button type="submit">Submit</button>
				</Form>
			</Formik>
		</>
	);
};

export default Workspaces;
