const initApp = require("./socketApp");
const healthCheck = require("./healthCheck");
const initStateManagerSocketApp = require("./stateManagerApp");

module.exports = {
	healthCheck,
	initApp,
	initStateManagerSocketApp,
};
