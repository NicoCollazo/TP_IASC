import axios from "axios";
import { useState, useRef } from "react";
import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Box,
	Typography,
	Container,
	createTheme,
	ThemeProvider,
} from "@mui/material";
import Notification from "./Notification";
import { useNavigate } from "react-router-dom";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_API_PORT}`;
const AUTH_URL = `${API_URL}/api/auth`;
const USERS_URL = `${API_URL}/api/users`;

const theme = createTheme();

export default function Register() {
	const inputPass = useRef();
	const inputUsername = useRef();
	const navigate = useNavigate();
	const [errorNotif, setErrorNotif] = useState({ open: false, message: "" });

	const login = (event) => {
		if (event.key === "Enter") {
			handleSubmit(event);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const registerValues = {
			name: inputUsername.current.value,
			password: inputPass.current.value,
		};

		axios
			.post(USERS_URL, registerValues, { withCredentials: true })
			.then((response) => {
				if (response.data.userId !== undefined) {
					// Log the user in.
					return axios.post(
						AUTH_URL,
						{
							username: registerValues.name,
							password: registerValues.password,
						},
						{
							withCredentials: true,
						}
					);
				} else {
					throw new Error("There was an issue with the user creation");
				}
			})
			.then((response) => {
				if (response.data.token !== undefined) {
					navigate("/workspace");
				} else {
					throw new Error("There was an issue with the user sign in");
				}
			})
			.catch((err) => {
				console.log(err);
				let errMsg = err;
				try {
					errMsg = err.response.data.error;
				} catch (_) {
					errMsg = err.message;
				}
				setErrorNotif({ open: true, message: errMsg });
			});
	};

	const onCloseNotif = () => {
		setErrorNotif({ open: false, message: "" });
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Notification
					notificationState={errorNotif}
					onClose={onCloseNotif}
					severity="error"
				/>
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, backgroundColor: "#478ea1" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Register
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
							inputRef={inputUsername}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							onKeyUp={login}
							inputRef={inputPass}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2, backgroundColor: "#478ea1" }}
						>
							Register
						</Button>
					</Box>
					<Button
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2, backgroundColor: "#478ea1" }}
						onClick={(e) => {
							e.preventDefault();
							navigate("/signIn");
						}}
					>
						Already have an account? Sign In here.
					</Button>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
