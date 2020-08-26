const express = require("express");
const mainRouter = express.Router();
const indexRouter = require("./index");
const usersRouter = require("./users");

mainRouter.use("/", indexRouter);
mainRouter.use("/users", usersRouter);

module.exports = mainRouter;
