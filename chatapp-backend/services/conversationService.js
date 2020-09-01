const mongoose = require("mongoose");
const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");

exports.getAllConversations = () => {
  return new Promise((resolve, reject) => {
    Conversation.find()
      .populate(["participants", "messages"])
      .exec((error, conversations) => {
        if (error) {
          reject(error);
        } else {
          resolve(conversations);
        }
      });
  });
};

exports.getConversation = (id) => {
  return new Promise((resolve, reject) => {
    Conversation.findById(id)
      .populate(["participants", "messages"])
      .exec((error, conversation) => {
        if (error) {
          reject(error);
        } else if (conversation) {
          resolve(conversation);
        } else {
          reject({ status: 404, message: "This conversation doesn't exists" });
        }
      });
  });
};

exports.createConversation = (conversation) => {
  return new Promise(async (resolve, reject) => {

    const users = await User.find().where("_id").in(conversation.users);
    if (users.length < 2) {
      reject({ errors: { message: "The user input is incorrect" } });
    }

    const conversations = await Conversation.find({ participants: users });
    if (conversations.length !== 0) {
      reject({ errors: { message: "This conversation already exists" } });
    }

    const newConversations = new Conversation({
      name: conversation.name,
      participants: users,
      messages: []
    });

    newConversations.save((error) => {
      if (error) {
        reject({ errors: { ...error, message: "There was an error while saving the conversation" } });
      }
      resolve();
    });
  });
};

exports.deleteConversation = (id) => {
  return new Promise(async (resolve, reject) => {
    Conversation
      .findById(id)
      .populate("messages")
      .exec((error, conversation) => {
        if (!conversation) {
          reject({ errors: { message: "The conversation doesn't exists" }, status: 400 });
          return;
        }

        if (conversation.messages.length > 0) {
          Message.deleteMany({ _id: conversation.messages }, (error) => {
            if (error) {
              reject({ errors: { ...error, message: "There was an error deleting messages" } });
              return;
            }

            Conversation.deleteOne({ id: mongoose.ObjectId(conversation._id, {}) }, () => {
              if (error) {
                reject({ errors: { ...error, message: "There was an error during the conversation deletion" } });
                return;
              }
              resolve();
            });

          });
        } else {
          Conversation.deleteOne({ id: mongoose.ObjectId(conversation._id, {}) }, () => {
            if (error) {
              reject({ errors: { ...error, message: "There was an error during the conversation deletion" } });
              return;
            }
            resolve();
          });
        }
      });
  });
};

exports.sendMessage = (id, messageInput) => {
  return new Promise(async (resolve, reject) => {
    Conversation
      .findById(id)
      .exec(async (error, conversation) => {
        if (!conversation) {
          reject({ errors: { message: "The conversation doesn't exists" }, status: 400 });
          return;
        }

        let sender;
        User.findById(messageInput.sender, (error, user) => {
          if (error) {
            reject({ errors: { ...error, message: "The user was not found" } });
            return;
          }

          sender = user;

          const message = new Message({
            text: messageInput.messageText,
            sender: user
          });

          message.save((error) => {
            if (error) {
              reject({ errors: { ...error, message: "There was an error while saving the message" } });
            }
            conversation.messages.push(message);
            conversation.save((error) => {
              if (error) {
                reject({ errors: { ...error, message: "There was an error while saving the conversation" } });
              }
              resolve();
            });
          });
        });
      });
  });
};

exports.getConversationsOfUser = (user) => {
  return new Promise((resolve, reject) => {
    Conversation.find({ participants: [user["_id"]] })
      .populate(["participants", "messages"])
      .exec((error, conversations) => {
        if (error) {
          reject(error);
        } else {
          resolve(conversations);
        }
      });
  });
};
