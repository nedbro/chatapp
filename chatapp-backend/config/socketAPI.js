let socket_io = require("socket.io");
const { getUserById } = require("../services/userService");
const { getConversationsOfUser } = require("../services/conversationService");
let io = socket_io();
let socketAPI = {};


io.on("connect", socket => {
  console.log("session connected");


  socket.on("subscribeToConversations", async (userId) => {
    console.log("userId", userId);
    const user = await getUserById(userId);
    const conversations = await getConversationsOfUser(user);
    conversations.forEach(conversation => {
      socket.join(conversation["_id"]);
      console.log("asd");
    });

  });
  socket.on("disconnect", () => console.log("session disconnected"));

});

socketAPI.io = io;
module.exports = socketAPI;
