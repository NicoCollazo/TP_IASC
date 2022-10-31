import { useParams } from "react-router-dom";

import DragList from "./Draglist";

const Workspace = () => {
	let params = useParams();

	return <DragList workspaceName={params.workspaceName} />;
};

export default Workspace;
