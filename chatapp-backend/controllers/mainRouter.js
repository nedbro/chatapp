const express = require("express");
const mainRouter = express.Router();
const userController = require("./userController");
const messageController = require("./messageController");
const conversationController = require("./conversationController");

mainRouter.use("/users", userController);
mainRouter.use("/messages", messageController);
mainRouter.use("/conversations", conversationController);

module.exports = mainRouter;
