import { useContext, useState, useEffect } from "react";
import { SocketContext } from "./context/socket";

import ServerStatus from "./components/ServerStatus";

function App() {
	const socket = useContext(SocketContext);
	const [serversStatus, setServersStatus] = useState([]);

	const addNewStatus = (statusList, newStatus) => {
		const newStatusList = [...statusList];

		if (
			newStatusList.length === 0 ||
			newStatusList.find((s) => s.name === newStatus.name) === undefined
		) {
			newStatusList.push(newStatus);
		} else {
			newStatusList[statusList.findIndex((s) => s.name === newStatus.name)] =
				newStatus;
		}

		console.log(newStatusList);
		return newStatusList;
	};

	useEffect(() => {
		const statusListener = (newStatus) => {
			setServersStatus((prevStatus) => addNewStatus(prevStatus, newStatus));
		};
		socket.on("publishStatus", statusListener);
		return () => socket.off("publishStatus", statusListener);
	});

	return (
		<>
			{serversStatus.map((status, idx) => (
				<ServerStatus data={status} idx={idx} />
			))}
		</>
	);
}

export default App;
