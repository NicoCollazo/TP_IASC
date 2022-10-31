import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { SocketContext, socket } from "./context/socket";

import Router from "./Routes";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<SocketContext.Provider value={socket}>
				<Router />
			</SocketContext.Provider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
