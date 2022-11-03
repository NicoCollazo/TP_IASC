const { UserDb } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger")(__filename);

const authenticate = async (req, res) => {
	// Validate the username exists.
	const user = UserDb.findOne(req.body.username);
	if (!user) {
		logger.error("Username doesn't exist in the DB");
		return res.status(400).json({
			error: "Username doesn't exist in the DB",
		});
	}

	// Validate password with bcrypt.
	const validPassword = await UserDb.validate(
		req.body.username,
		req.body.password
	);
	if (!validPassword) {
		logger.error("Username or password are incorrect");
		return res.status(400).json({
			error: "Username or password are incorrect",
		});
	}

	// create token
	const token = jwt.sign(
		{ name: user.name, id: user.id },
		process.env.TOKEN_SECRET,
		{ expiresIn: process.env.TOKEN_TTL }
	);

	logger.info(`Succesfully validated User ${user.username}`);

	res.cookie("auth_token", token).json({ token });
};

module.exports = authenticate;
