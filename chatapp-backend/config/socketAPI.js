const socket_io = require("socket.io");
const io = socket_io();
const { getUserById } = require("../services/userService");
const conversationService = require("../services/conversationService");

io.on("connect", (socket, next) => {
  socket.on("subscribeToConversations", async (userId) => {
    const user = await getUserById(userId);
    try {
      const conversations = await conversationService.getConversationsOfUserForSubscribing(
        user
      );
      conversations.forEach((conversation) => {
        socket.join(conversation["_id"]);
      });
      socket.emit("subscribedToConversations");
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("sendMessage", async (conversationId, messageInput) => {
    const validationResult = await conversationService.validateSendMessageInput(
      conversationId,
      messageInput
    );

    if (validationResult) {
      try {
        const message = await conversationService.sendMessage(
          validationResult.conversation,
          validationResult.messageInput
        );

        io.to(conversationId).emit("thereIsANewMessage");
        io.to(conversationId).emit(`newMessageIn${conversationId}`, message);
      } catch (error) {
        console.log(error);
      }
    }
  });

  socket.on("disconnect", () => console.log("session disconnected"));
});

const socketAPI = {};
socketAPI.io = io;
module.exports = socketAPI;
