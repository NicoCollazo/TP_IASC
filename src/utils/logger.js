const winston = require("winston");

const logger = winston.createLogger({
	format: winston.format.json(),
	transports: [
		new winston.transports.File({
			filename: "logs/errors.log",
			level: "error",
		}),
		new winston.transports.File({ filename: "logs/all.log" }),
	],
});

const prettyJsonFormat = winston.format.printf((info) => {
	if (info.message && info.message.constructor === Object) {
		info.message = JSON.stringify(info.message, null, 2);
	}
	return `${info.level}: ${info.message}`;
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.prettyPrint(),
				winston.format.splat(),
				winston.format.simple(),
				prettyJsonFormat
			),
		})
	);
}

const getLogger = (filename) => {
	const relativePath = filename.split("\\src\\")[1];

	return logger.child({ moduleName: relativePath });
};

module.exports = getLogger;
