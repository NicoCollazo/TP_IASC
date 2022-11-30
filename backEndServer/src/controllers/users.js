const BaseController = require("./base");
const { UserDb } = require("../models");
const getLogger = require("../utils/logger");
const logger = getLogger(__filename);

class UsersController extends BaseController {
	registerUser = async (req, res, stateManagerSocket) => {
		const username = req.body.name;
		const password = req.body.password;

		return this._promiseEmitWithTimeout(
			stateManagerSocket.emit.bind(stateManagerSocket),
			"attemptToAddUser",
			{
				username,
				password,
			}
		)
			.then((data) => {
				return UserDb.register(data.username, data.password);
			})
			.then((user) =>
				res.status(201).json({
					message: "User created successfully.",
					userId: user.id,
				})
			)
			.catch((err) => {
				logger.error(err);
				res
					.status(400)
					.json({ message: `${err}` })
					.end();
			});
	};
}

module.exports = UsersController;
