const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const debug = require("debug")("chatapp-backend:server");
const http = require("http");
const socketAPI = require("./config/socketAPI");
const initializePassport = require("./config/passport-config");
const db = require("./config/db");
const mainRouter = require("./controllers/mainRouter");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3001" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const sessionObject = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

app.use(sessionObject);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", mainRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  console.log("error", err);
  res.json(err);
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
socketAPI.io.use(wrap(sessionObject));
socketAPI.io.use(wrap(passport.initialize()));
socketAPI.io.use(wrap(passport.session()));

socketAPI.io.use((socket, next) => {
  if (socket.request.user) {
    console.log("MEGVAN A USER");
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
socketAPI.io.attach(server);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

module.exports = app;
