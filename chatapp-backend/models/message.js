const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: { type: String, required: true, minLength: 1, maxLength: 250 },
  sent_at: { type: Date, default: Date.now() },
  sender: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Message", MessageSchema);
