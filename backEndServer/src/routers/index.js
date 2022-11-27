const { Router } = require("express");

const authRouter = require("./auth");
const usersRouter = require("./users");

const router = Router();

authRouter(router);
usersRouter(router);

module.exports = router;
