import React from "react";
import DragList from "./components/Draglist";
import { SocketContext, socket } from "./context/socket";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
	return (
		<SocketContext.Provider value={socket}>
			<DragList />
		</SocketContext.Provider>
	);
}

export default App;
