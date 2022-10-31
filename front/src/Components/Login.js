import { Formik, Field, Form } from "formik";
import styled from "styled-components";

const Login = ({ setToken }) => {
	return (
		<>
			<Header></Header>
			<Formik
				initialValues={{
					username: "",
					password: "",
				}}
				onSubmit={async (values) => {
					try {
						const data = await fetch("http://localhost:8080/api/auth", {
							method: "POST",
							headers: {
								"Access-Control-Allow-Origin": "*",
								"Content-Type": "application/json",
							},
							body: JSON.stringify(values),
						});
						setToken(data.token);
					} catch {
						setToken(null);
					}
				}}
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
