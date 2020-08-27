const express = require("express");
const mainRouter = express.Router();
const userController = require("./userController");
const messageController = require("./messageController");

mainRouter.use("/users", userController);
mainRouter.use("/messages", messageController);

module.exports = mainRouter;
