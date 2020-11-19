const mongoose = require("mongoose");
const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");
const validator = require("validator");

exports.getAllConversations = async () => {
  return Conversation.find().populate(["participants", "messages"]);
};

exports.getConversation = async (id) => {
  return Conversation.findById(id).populate(["participants", "messages"]);
};

exports.createConversation = async (conversation) => {
  const users = await User.find().where("_id").in(conversation.users);
  if (users.length < 2) throw { message: "The user input is incorrect" };

  const conversations = await Conversation.find({ participants: users });
  if (conversations.length !== 0)
    throw { message: "This conversation already exists" };

  const newConversation = new Conversation({
    name: conversation.name,
    participants: users,
    messages: [],
  });

  await newConversation.save();
  return newConversation;
};

exports.deleteConversation = async (id) => {
  const conversation = await Conversation.findById(id).populate("messages");
  if (!conversation) throw { message: "The conversation doesn't exists" };
  if (conversation.messages.length > 0) {
    await Message.deleteMany({ _id: conversation.messages });
  }
  await Conversation.deleteOne({ _id: conversation._id });
};

exports.sendMessage = async (conversation, messageInput) => {
  const message = new Message({
    text: messageInput.messageText,
    sender: messageInput.sender,
    conversation: conversation,
  });

  await message.save();
  conversation.messages.push(message);
  conversation.last_active = message.sent_at;
  await conversation.save();
  return message.toObject({ depopulate: true });
};

exports.getConversationsOfUser = async (user) => {
  return await Conversation.find()
    .where("participants")
    .in([user])
    .populate("messages participants")
    .sort({ last_active: -1 })
    .limit(5);
};

exports.getConversationsOfUserForCards = async (user) => {
  const conversations = await Conversation.find()
    .where("participants")
    .in([user])
    .populate("messages participants")
    .sort({ last_active: -1 })
    .limit(5);

  conversations.forEach((conversation) => {
    if (conversation.messages.length > 0) {
      conversation.messages = conversation.messages.slice(
        conversation.messages.length - 1,
        conversation.messages.length
      );
    }
  });

  return conversations;
};

exports.getConversationWithoutMessages = async (conversationId) => {
  return Conversation.findById(conversationId).populate(["participants"]);
};

exports.getConversationsOfUserForSubscribing = async (user) => {
  return await Conversation.find().where("participants").in([user]);
};

exports.validateSendMessageInput = async (conversationId, messageInput) => {
  if (!messageInput || validator.isEmpty(messageInput.messageText))
    return false;

  let conversation;
  let sender;

  try {
    conversation = await Conversation.findById(conversationId);
  } catch (error) {
    return false;
  }

  try {
    sender = await User.findById(messageInput.sender);
  } catch (error) {
    return false;
  }

  messageInput.sender = sender;

  return { conversation, messageInput };
};
