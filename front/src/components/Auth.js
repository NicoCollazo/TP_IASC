import axios from "axios";
import { useState } from "react";
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
	Snackbar,
	Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";

const AUTH_URL = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_API_PORT}/api/auth`;

const theme = createTheme();

export default function Auth() {
	const [errorNotif, setErrorNotif] = useState({ open: false, message: "" });
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const loginValues = {
			username: data.get("username"),
			password: data.get("password"),
		};

		axios
			.post(AUTH_URL, loginValues, { withCredentials: true })
			.then((response) => {
				if (response.data.token !== undefined) {
					navigate("/workspace");
				}
			})
			.catch((err) => {
				console.log(err);
				const errMsg = err.response.data.error;
				setErrorNotif({ open: true, message: errMsg });
			});
	};

	const onCloseNotif = () => {
		setErrorNotif({ open: false, message: "" });
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<Box sx={{ padding: 4 }}>
					<Typography variant="h6" color="initial">
						WELCOME TO OUR TODO LIST APP
					</Typography>
				</Box>
				<CssBaseline />
				<Snackbar
					open={errorNotif.open}
					onClose={onCloseNotif}
					autoHideDuration={3000}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
				>
					<Alert onClose={onCloseNotif} severity="error">
						{errorNotif.message}
					</Alert>
				</Snackbar>
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
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
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
