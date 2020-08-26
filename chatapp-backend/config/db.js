const mongoose = require("mongoose");

const mongoDB = "mongodb://userName:test1234@localhost:27017/chatapp";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = db;
