const { UserDb } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger")(__filename);

const authenticate = async (req, res) => {
	// Validate the username exists.
	const user = UserDb.findOne(req.body.username);
	if (!user) {
		logger.error("Username or password are incorrect");
		return res.status(400).json({
			error: "Username or password are incorrect",
		});
	}

	// Validate password with bcrypt.
	// const salt = await bcrypt.genSalt(10);
	// const pHash = await bcrypt.hash(req.body.password, salt);

	const validPassword = await bcrypt.compare(
		req.body.password,
		user.passwordHash
	);
	if (validPassword) {
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

	res.header("auth-token", token).json({
		data: { token },
	});
};

module.exports = authenticate;
