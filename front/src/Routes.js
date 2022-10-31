import { Route, Routes } from "react-router-dom";

import App from "./App";
import Login from "./components/Login";
import Workspace from "./components/Workspace";
import Workspaces from "./components/Workspaces";

const Router = () => {
	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/login" element={<Login />} />
			<Route path="/workspace">
				<Route index element={<Workspaces />} />
				<Route path=":workspaceName" element={<Workspace />} />
			</Route>
		</Routes>
	);
};

export default Router;
