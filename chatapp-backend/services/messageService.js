const Message = require("../models/message");

exports.getAllMessages = async () => {
  return await Message.find();
};

exports.createMessage = async (message) => {
  const newMessage = new Message({
    text: message.text
  });
  await newMessage.save();
};

