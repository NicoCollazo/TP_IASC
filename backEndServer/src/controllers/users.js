const { UserDb } = require("../models");
const getLogger = require("../utils/logger");
const logger = getLogger(__filename);

class UsersController {
	registerUser = async (req, res) => {
		try {
			const user = await UserDb.register(req.body.name, req.body.password);

			return res.status(201).json({
				message: "User created successfully.",
				userId: user.id,
			});
		} catch (err) {
			logger.error(err);
			return res
				.status(400)
				.json({ message: `${err}` })
				.end();
		}
	};
}

module.exports = UsersController;
