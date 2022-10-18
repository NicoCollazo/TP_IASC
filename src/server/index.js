const express = require("express");
const startDatabase = require("./database");

const initApp = (app) => {
  // For app configurations.
  app.set("json spaces", 4);
  app.use(express.json());
};

module.exports = { initApp, startDatabase };
