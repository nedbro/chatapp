const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: { type: String, required: true, minLength: 1, maxLength: 250 },
  sent_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Message", MessageSchema);
