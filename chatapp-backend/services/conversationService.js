const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");
const async = require("async");

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

exports.createConversation = (conversation) => {
  return new Promise(async (resolve, reject) => {

    const users = await User.find().where("_id").in(conversation.users);
    if (users.length < 2) {
      reject({ message: "The user input is incorrect" });
    }

    const message = await new Message({ text: conversation.message });

    const conversations = await Conversation.find({ participants: users });
    if (conversations.length !== 0) {
      reject({ message: "This conversation already exists" });
    }

    const newConversations = new Conversation({
      name: conversation.name,
      participants: users,
      messages: [message]
    });
    newConversations.save((error) => {
      if (error) {
        reject(error);
      }
      message.save((error) => {
        if (error) {
          reject(error);
        }
        resolve(newConversations);
      });
    });
  });
};

exports.deleteConversation = (id) => {
  return new Promise(async (resolve, reject) => {
    console.log("id", id);
    Conversation
      .findById(id)
      .populate("messages")
      .exec((error, conversation) => {
        Message.deleteMany({ _id: conversation.messages }).then((error) => {
          if (error) {
            reject({ message: "There was an error deleting messages" });
          }

          Conversation.deleteOne({ id: conversation._id }).then((error) => {
            if (error) {
              reject(error);
            }

            resolve();
          });
        });
      });
  });
};
