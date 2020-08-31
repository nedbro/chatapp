const express = require("express");
const mainRouter = express.Router();
const userController = require("./userController");
const messageController = require("./messageController");
const conversationController = require("./conversationController");
const loginController = require("./loginController");

mainRouter.use("/users", userController);
mainRouter.use("/messages", messageController);
mainRouter.use("/conversations", conversationController);
mainRouter.use("/auth", loginController);

module.exports = mainRouter;
