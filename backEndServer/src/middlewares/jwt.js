const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const { UserDb } = require("../models");
const getLogger = require("../utils/logger");
const logger = getLogger(__filename);

const verifyTokenSocket = (UserDb, socket, next) => {
	const socket_cookies = socket.request.headers.cookie;
	const auth_token = cookie.parse(socket_cookies).auth_token;
	if (auth_token) {
		jwt.verify(auth_token, process.env.TOKEN_SECRET, (err, decoded) => {
			if (err) next(new Error("Authentication error"));
			const user_id = decoded.id;
			const user = UserDb.findById(user_id);
			if (user !== undefined) {
				socket.user = user;
				next();
			} else {
				logger.error({
					message: "Token is valid but user doesn't exist",
					user_id,
				});
				next(new Error("Token is valid but user doesn't exist"));
			}
		});
	} else {
		logger.error({
			message: "Authentication error, auth data is missing",
			cookies: socket_cookies,
		});
		next(new Error("Authentication error"));
	}
};

const checkUserIdInCookies = (socket, next) => {
	const socket_cookies = socket.request.headers.cookie;
	const userId = cookie.parse(socket_cookies).auth_token;
	if (userId) {
		const user = UserDb.findById(userId);
		if (user !== undefined) {
			socket.user = user;
			next();
		} else {
			logger.error({
				message: `User with id ${userId} doesn't exist`,
			});
			next(new Error(`User with id ${userId} doesn't exist`));
		}
	} else {
		logger.error({
			message: "Authentication error, auth data is missing",
			cookies: socket_cookies,
		});
		next(new Error("Authentication error"));
	}
};

module.exports = { verifyTokenSocket, checkUserIdInCookies };
