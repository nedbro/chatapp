const socket_io = require("socket.io");
const io = socket_io();
const { getUserById } = require("../services/userService");
const { getConversationsOfUser } = require("../services/conversationService");

const conversationService = require("../services/conversationService");

io.on("connect", (socket, next) => {
  console.log("session connected");

  socket.on("subscribeToConversations", async (userId) => {
    const user = await getUserById(userId);
    const conversations = await getConversationsOfUser(user);
    conversations.forEach((conversation) => {
      socket.join(conversation["_id"]);
      console.log("asd");
    });
    socket.emit("sentCurrentUsersConversations", conversations);
  });

  socket.on("sendMessage", async (conversationId, messageInput) => {
    console.log("conversationId", conversationId);
    console.log("messageInput", messageInput);

    const validationResult = await conversationService.validateSendMessageInput(
      conversationId,
      messageInput
    );

    console.log("validationResult", validationResult);

    if (validationResult) {
      try {
        await conversationService.sendMessage(
          validationResult.conversation,
          validationResult.messageInput
        );

        io.to(conversationId).emit("thereIsANewMessage");
      } catch (error) {
        console.log(error);
      }
    }
  });

  socket.on("askForLatestConversations", async (userId) => {
    const user = await getUserById(userId);
    const conversations = await getConversationsOfUser(user);
    socket.emit("sentCurrentUsersConversations", conversations);
  });

  socket.on("disconnect", () => console.log("session disconnected"));
});

const socketAPI = {};
socketAPI.io = io;
module.exports = socketAPI;
