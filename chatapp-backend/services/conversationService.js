const mongoose = require("mongoose");
const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");

exports.getAllConversations = async () => {
  return Conversation.find()
    .populate(["participants", "messages"]);
};

exports.getConversation = async (id) => {
  return Conversation.findById(id)
    .populate(["participants", "messages"]);
};

exports.createConversation = async (conversation) => {
  const users = await User.find().where("_id").in(conversation.users);
  if (users.length < 2) throw { message: "The user input is incorrect" };

  const conversations = await Conversation.find({ participants: users });
  if (conversations.length !== 0) throw { message: "This conversation already exists" };

  const newConversation = new Conversation({
    name: conversation.name,
    participants: users,
    messages: []
  });

  await newConversation.save();
  return newConversation;
};

exports.deleteConversation = async (id) => {
  const conversation = await Conversation
    .findById(id)
    .populate("messages");
  if (!conversation) throw  { message: "The conversation doesn't exists" };
  if (conversation.messages.length > 0) {
    await Message.deleteMany({ _id: conversation.messages });
  }
  await Conversation.deleteOne({ _id: conversation._id });
};

exports.sendMessage = async (id, messageInput) => {
  const conversation = await Conversation.findById(id);
  if (!conversation) {
    throw  { message: "The conversation doesn't exists" };
  }

  const sender = await User.findById(messageInput.sender);

  const message = new Message({
    text: messageInput.messageText,
    sender: sender
  });

  await message.save();
  conversation.messages.push(message);
  await conversation.save();
};

exports.getConversationsOfUser = async (user) => {
  return await Conversation.find().where("participants").in([user])
    .populate("messages participants");
};
