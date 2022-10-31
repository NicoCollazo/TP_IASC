import axios from "axios";
import * as React from "react";
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
	CardHeader,
	IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const AUTH_URL = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_API_PORT}/api/auth`;

const theme = createTheme();

export default function Auth() {
	const navigate = useNavigate();
	const handleSubmit = (event) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const loginValues = {
			user: data.get("username"),
			password: data.get("password"),
		};

		axios
			.post(AUTH_URL, loginValues)
			.then((response) => {
				if (response.token !== undefined) {
					navigate("/workspace");
				}
			})
			.catch(function (error) {
				console.log(error);
				// Display error message on screen.
			});
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