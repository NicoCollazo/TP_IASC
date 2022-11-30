const { UsersController } = require("../controllers");

const usersRouter = (router, stateManagerSocket) => {
	const controller = new UsersController();

	router.post("/users", async (req, res) =>
		controller.registerUser(req, res, stateManagerSocket)
	);
	return router;
};

module.exports = usersRouter;
