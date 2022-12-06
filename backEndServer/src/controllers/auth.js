const { UserDb } = require("../models");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger")(__filename);

// Deprecated since we are moving to the user id.
const jwtAuthenticate = async (req, res) => {
	// Validate the username exists.
	const user = UserDb.findOne(req.body.username);
	if (user === undefined) {
		logger.error(`Username ${req.body.username} doesn't exist in the DB`);
		return res.status(400).json({
			error: "Username or password is incorrect",
		});
	}

	// Validate password with bcrypt.
	const validPassword = await UserDb.validate(
		req.body.username,
		req.body.password
	);
	if (!validPassword) {
		logger.error("Username or password is incorrect");
		return res.status(400).json({
			error: "Username or password is incorrect",
		});
	}
	const token = jwt.sign(
		{ name: user.name, id: user.id },
		process.env.TOKEN_SECRET,
		{ expiresIn: process.env.TOKEN_TTL }
	);

	logger.info(`Succesfully validated User ${user.username}`);

	res.cookie("auth_token", token).json({ token });
};

const authenticate = async (req, res) => {
	// Validate the username exists.
	const user = UserDb.findOne(req.body.username);
	if (user === undefined) {
		logger.error(`Username ${req.body.username} doesn't exist in the DB`);
		return res.status(400).json({
			error: "Username or password is incorrect",
		});
	}

	// Validate password with bcrypt.
	const validPassword = await UserDb.validate(
		req.body.username,
		req.body.password
	);
	if (!validPassword) {
		logger.error("Username or password is incorrect");
		return res.status(400).json({
			error: "Username or password is incorrect",
		});
	}

	logger.info(`Succesfully validated User ${user.username}`);

	res.cookie("auth_token", user.id).json({ token: user.id });
};

module.exports = authenticate;
