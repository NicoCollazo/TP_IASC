import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const AUTH_URL = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_API_PORT}/api/auth`;

const Login = () => {
	const navigate = useNavigate();

	const handleOnSubmit = (values) => {
		fetch(AUTH_URL, {
			method: "POST",
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(values),
		})
			.then((res) => {
				res
					.json()
					.then((resBody) => {
						if (resBody.token !== undefined) {
							navigate("/workspace");
						}
						// Display error message.
					})
					.catch((err) => {
						// Display error message.
					});
			})
			.catch((err) => {
				// Display error message.
			});
	};

	return (
		<>
			<Header></Header>
			<Formik
				initialValues={{
					username: "",
					password: "",
				}}
				onSubmit={handleOnSubmit}
			>
				<Form>
					<label htmlFor="username">Username</label>
					<Field id="username" name="username" placeholder="Jane" />
					<label htmlFor="password">Password</label>
					<Field
						id="password"
						name="password"
						placeholder="password"
						type="password"
					/>
					<button type="submit">Submit</button>
				</Form>
			</Formik>
			<Footer></Footer>
		</>
	);
};

export default Login;

const Header = styled.div``;

const Footer = styled.div``;
