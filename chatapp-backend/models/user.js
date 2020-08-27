const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, minLength: 1, maxLength: 15 },
  password: { type: String, required: true, minLength: 1 }
});

module.exports = mongoose.model("User", UserSchema);
