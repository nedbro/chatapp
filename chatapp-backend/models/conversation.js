const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  name: { type: String, required: true, default: "" },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  last_active: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
