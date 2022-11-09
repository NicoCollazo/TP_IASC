import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	Container,
	Typography,
	AppBar,
	Toolbar,
	Box,
	TextField,
	Button,
	Grid,
} from "@mui/material";

import { SocketContext } from "../context/socket";
const socket_url = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_SOCKET_PORT}`;

const Workspaces = () => {
	const socket = useContext(SocketContext);
	const [newWorkspace, setNewWorkspace] = useState("");
	const navigate = useNavigate();
	const [workspaceList, setWorkspaceList] = useState([]);

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
			navigate("/");
		});

		socket.emit("allWorkspaces");
		socket.on("allWorkspaces", (workspaces) => {
			setWorkspaceList(workspaces);
		});
	}, []);

	// Keep listening for New Workspaces that might be created by other users in the organization
	useEffect(() => {
		const newWorkspacepListener = (workspace) => {
			setWorkspaceList((oldList) => [...oldList, workspace]);
		};
		const deleteWorkspaceListener = (workspace) => {
			setWorkspaceList((oldList) =>
				oldList.filter((w) => w.id !== workspace.id)
			);
		};

		socket.on("deleteWorkspace", deleteWorkspaceListener);
		socket.on("newWorkspace", newWorkspacepListener);
		return () => {
			socket.off("newWorkspace", newWorkspacepListener);
			socket.off("deleteWorkspace", deleteWorkspaceListener);
		};
	});

	const handleSubmit = () => {
		setNewWorkspace("");
		if (newWorkspace === "") {
			return;
		}
		socket.emit(
			"addWorkspace",
			{ name: newWorkspace, id: uuidv4() },
			(nWorkspace) => {
				if (nWorkspace.message === undefined) {
					setWorkspaceList((oldList) => [...oldList, nWorkspace]);
				} else {
					// TODO: Display error message if no ACK is returned
					// or if the ACK is not a workspace.
				}
			}
		);
	};

	const handleChange = (event) => {
		setNewWorkspace(event.target.value);
	};

	// TODO: Add buttons to delete a workspace (maybe how we handle task deletion?)
	return (
		<Container maxWidth="lg">
			<AppBar position="fixed" sx={{ backgroundColor: "#aab6ab" }}>
				<Toolbar>
					<Typography variant="h6">ToDo App</Typography>
				</Toolbar>
			</AppBar>
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
									<Grid key={`${w.name}__${idx}`} item>
										<Button
											component={Link}
											to={"/workspace/" + w.name}
											sx={{ mr: 1, mt: 1 }}
											variant="outlined"
										>
											{w.name}
										</Button>
									</Grid>
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
								value={newWorkspace}
								onChange={handleChange}
								name="newWorkspace"
								label="Workspace"
								type="text"
								id="newWorkspace"
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
