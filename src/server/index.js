const express = require("express");
const initSocketApp = require("./socketApp");
const healthCheck = require("./healthCheck");
const initStateManagerSocketApp = require("./stateManagerApp");
const { startDatabase, checkDatabaseConnection } = require("./database");

const initApi = (app) => {
	// For app configurations.
	app.set("json spaces", 4);
	app.use(express.json());
};

module.exports = {
	initApi,
	healthCheck,
	initSocketApp,
	startDatabase,
	checkDatabaseConnection,
	initStateManagerSocketApp,
};
