const express = require("express");
const mainRouter = express.Router();
const indexRouter = require("./index");
const usersRouter = require("./users");
const messageController = require("./messageController");

mainRouter.use("/", indexRouter);
mainRouter.use("/users", usersRouter);
mainRouter.use("/messages", messageController);

module.exports = mainRouter;
