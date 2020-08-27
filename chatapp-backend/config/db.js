const mongoose = require("mongoose");
process.env.MONGO_URL = "mongodb://userName:test1234@localhost:27017/chatapp";
const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = db;
