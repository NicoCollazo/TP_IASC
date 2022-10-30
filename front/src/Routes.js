import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import App from "./App";
import Login from "./components/Login";
import Workspace from "./components/Workspace";
import Workspaces from "./components/Workspaces";

const Router = () => {
	const [token, setToken] = useState(null);

	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/login" element={<Login setToken={setToken} />} />
			<Route path="/workspace">
				<Route index element={<Workspaces token={token} />} />
				<Route path=":workspaceName" element={<Workspace token={token} />} />
			</Route>
		</Routes >
	);
};

export default Router;
