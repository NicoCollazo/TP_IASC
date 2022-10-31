import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import DragList from "./Components/Draglist";
import Auth from "./Components/Auth";
import Login from "./Components/Login";
import Workspace from "./Components/Workspace";
import Workspaces from "./Components/Workspaces";

const Router = () => {
	const [token, setToken] = useState(null);

	return (
		<Routes>
			<Route path="/" element={<Auth setToken={setToken} />} />
			<Route path="/workspace">
				<Route index element={<Workspaces token={token} />} />
				<Route path=":workspaceName" element={<Workspace token={token} />} />
			</Route>
		</Routes >
	);
};

export default Router;
