import { Route, Routes } from "react-router-dom";
import Auth from "./Components/Auth";
import Workspace from "./Components/Workspace";
import Workspaces from "./Components/Workspaces";

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
