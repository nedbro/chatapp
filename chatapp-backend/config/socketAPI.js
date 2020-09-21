const socket_io = require("socket.io");
const passport = require("passport");
const session = require("express-session");
const cookieParse = require("cookie-parser")();
const io = socket_io();
const { getUserById } = require("../services/userService");
const { getConversationsOfUser } = require("../services/conversationService");

const initializePassport = require("./passport-config");
initializePassport(passport);

const passportInit = passport.initialize();
const passportSession = passport.session();

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

io.use((socket, next) => {
  socket.client.request.originalUrl = socket.client.request.url;
  cookieParse(socket.client.request, socket.client.request.res, next);
});

io.use((socket, next) => {
  socket.client.request.originalUrl = socket.client.request.url;
  sessionMiddleware(socket.client.request, socket.client.request.res, next);
});

io.use((socket, next) => {
  passportInit(socket.client.request, socket.client.request.res, next);
});

io.use((socket, next) => {
  passportSession(socket.client.request, socket.client.request.res, next);
});

io.use((socket, next) => {
  console.log(socket.request.user)
  if (socket.request.user) {
    console.log("autentikálva van");
    next();
  } else {
    console.log("nincs user");
    next(new Error("unauthorized"));
  }
});

io.on("connect", (socket) => {
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

  socket.on("disconnect", () => console.log("session disconnected"));
});

const socketAPI = {};
socketAPI.io = io;
module.exports = socketAPI;
