import { useParams } from "react-router-dom";

import DragList from "./Draglist";

const Workspace = ({ userToken }) => {
	let params = useParams();

	return (
		<DragList userToken={userToken} workspaceName={params.workspaceName} />
	);
};

export default Workspace;
