const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const getLogger = require("../utils/logger");
const logger = getLogger(__filename);

const verifyToken = (req, res, next) => {
	const token = req.header("auth-token");
	if (!token) {
		const error_msg = { error: "Access denied" };
		logger.error({ ...error_msg, url: req.url });
		return res.status(401).json(error_msg);
	}
	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verified;
		next();
	} catch (error) {
		logger.error({ trace: error, url: req.url });
		res.status(400).json({ error: "Token invalid or expired" });
	}
};

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

module.exports = { verifyToken, verifyTokenSocket };
