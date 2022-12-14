import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import {
	Box,
	Card,
	Grid,
	Button,
	AppBar,
	Toolbar,
	Container,
	TextField,
	Typography,
	CardHeader,
	CardContent,
} from "@mui/material";
import Notification from "./Notification";
import WorkspaceButton from "./WorkspaceButton";
import { SocketContext } from "../context/socket";
import React from "react";
const socket_url = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SOCKET_PORT}`;

const defaultWorkspace = { name: "", shared: "" };
const Workspaces = () => {
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const [newWorkspace, setNewWorkspace] = useState(defaultWorkspace);
	const [workspaceList, setWorkspaceList] = useState([]);
	const [errorNotif, setErrorNotif] = useState({ open: false, message: "" });
	const [hover, setHover] = useState("none");

	// Load the list of previously created workspaces once during the first rendering
	useEffect(() => {
		// Force Reconnect to validate the auth_token.
		socket.disconnect().connect(socket_url, {
			withCredentials: true,
			forceNew: true,
		});

		// If connection fails, we redirect to Login.
		socket.on("connect_error", () => {
			// TODO: Let the user know about the redirect.
			// Maybe do a 2 sec timer.
			navigate("/signIn");
		});

		socket.emit("getAllWorkspaces");
		socket.on("allWorkspaces", (workspaces) => {
			setWorkspaceList(workspaces);
		});
	}, []);

	// Keep listening for New Workspaces that might be created by other users in the organization
	useEffect(() => {
		const newWorkspaceListener = (workspace) => {
			setWorkspaceList((oldList) => [...oldList, workspace]);
		};
		const deleteWorkspaceListener = (workspace) => {
			setWorkspaceList((oldList) =>
				oldList.filter((w) => w.id !== workspace.id)
			);
		};

		socket.on("deleteWorkspace", deleteWorkspaceListener);
		socket.on("newWorkspace", newWorkspaceListener);
		return () => {
			socket.off("newWorkspace", newWorkspaceListener);
			socket.off("deleteWorkspace", deleteWorkspaceListener);
		};
	});

	const onCloseNotif = () => {
		setErrorNotif({ open: false, message: "" });
	};

	const handleSubmit = () => {
		if (newWorkspace.name === undefined || newWorkspace.name === "") {
			setNewWorkspace(defaultWorkspace);
			return;
		}

		let sharedWith = [];
		if (newWorkspace.shared !== "") {
			sharedWith = newWorkspace.shared.split(",");
		}

		socket.emit(
			"addWorkspace",
			{
				name: newWorkspace.name,
				shared: sharedWith,
				id: uuidv4(),
			},
			(nWorkspace) => {
				if (
					nWorkspace.message === undefined &&
					nWorkspace.error === undefined
				) {
					setWorkspaceList((oldList) => [...oldList, nWorkspace]);
				} else {
					const errMsg = nWorkspace.message || nWorkspace.error;
					console.log(errMsg);
					setErrorNotif({ open: true, message: errMsg });
				}
			}
		);
		setNewWorkspace(defaultWorkspace);
	};

	function redirectToWorkspace(workspace) {
		navigate("/workspace/" + workspace);
	}

	function handleEdit(editedWorkspace) {}

	function handleDelete(workspace) {
		socket.emit("deleteWorkspace", workspace, (deletedWorkspace) => {
			if (
				deletedWorkspace.message === undefined &&
				deletedWorkspace.error === undefined
			) {
				setWorkspaceList((current) =>
					current.filter((w) => w.id !== workspace.id)
				);
			} else {
				const errMsg = deletedWorkspace.message || deletedWorkspace.error;
				console.log(errMsg);
				setErrorNotif({ open: true, message: errMsg });
			}
		});
	}

	return (
		<Container maxWidth="lg">
			<AppBar position="fixed" sx={{ backgroundColor: "#478ea1" }}>
				<Toolbar>
					<Typography variant="h6">TODO APP</Typography>
				</Toolbar>
			</AppBar>
			<Notification
				notificationState={errorNotif}
				onClose={onCloseNotif}
				severity="error"
			/>
			<Box sx={{ margin: 4, paddingTop: 4 }}>
				<Card sx={{ marginTop: 4 }}>
					<CardHeader
						title="Select a workspace"
						titleTypographyProps={{ align: "left" }}
						sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === "light"
									? theme.palette.grey[200]
									: theme.palette.grey[700],
						}}
					/>
					<CardContent>
						<Box
							sx={{
								display: "flex",
								justifyContent: "left",
								alignItems: "baseline",
								mb: 2,
							}}
						>
							<Grid container spacing={0}>
								{workspaceList.map((w, idx) => (
									<WorkspaceButton
										item={w}
										handleEdit={handleEdit}
										handleDelete={handleDelete}
										redirectToWorkspace={redirectToWorkspace}
									/>
								))}
							</Grid>
						</Box>
					</CardContent>
				</Card>

				<Card sx={{ marginTop: 4 }}>
					<CardHeader
						title="Create a workspace"
						titleTypographyProps={{ align: "left" }}
						sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === "light"
									? theme.palette.grey[200]
									: theme.palette.grey[700],
						}}
					/>
					<CardContent>
						<Box sx={{ mt: 1 }}>
							<TextField
								margin="normal"
								required
								fullWidth
								onChange={(e) =>
									setNewWorkspace((prevWorkspace) => {
										return {
											...prevWorkspace,
											name: e.target.value,
										};
									})
								}
								value={newWorkspace.name || ""}
								name="newWorkspace"
								label="Workspace"
								type="text"
								id="newWorkspace"
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								onChange={(e) =>
									setNewWorkspace((prevWorkspace) => {
										return {
											...prevWorkspace,
											shared: e.target.value,
										};
									})
								}
								value={newWorkspace.shared || ""}
								name="shareWorkspace"
								label="Share with"
								type="text"
								id="shareWorkspace"
							/>
							<Button
								onClick={handleSubmit}
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Create
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
};

export default Workspaces;
