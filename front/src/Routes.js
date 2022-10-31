import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import Workspace from "./components/Workspace";
import Workspaces from "./components/Workspaces";

const Router = () => {
	return (
		<Routes>
			<Route path="/" element={<Auth />} />
			<Route path="/workspace">
				<Route index element={<Workspaces />} />
				<Route path=":workspaceName" element={<Workspace />} />
			</Route>
		</Routes>
	);
};

export default Router;
