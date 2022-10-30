import { Formik, Field, Form } from "formik";
import styled from "styled-components";

const Login = ({ setToken }) => {
	return (
		<>
			<Header></Header>
			<Formik
				initialValues={{
					username: '',
					password: '',
				}}
				onSubmit={async (values) => {
					// Fetch to the backend for token.
					// await new Promise((r) => setTimeout(r, 500));
					// setToken(data.token)
				}}
			>
				<Form>
					<label htmlFor="username">Username</label>
					<Field id="username" name="username" placeholder="Jane" />

					<label htmlFor="password">Password</label>
					<Field
						id="password"
						name="password"
						placeholder="jane@acme.com"
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
