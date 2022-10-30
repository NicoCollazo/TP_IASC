import { Link } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
	return (
		<>
			<div>Welcome to our Todo List App</div>
			<Link to="/login">Login</Link>
		</>
	);
}

export default App;
