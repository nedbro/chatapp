const Message = require("../models/message");

exports.getAllMessages = () => {
  return new Promise((resolve, reject) => {
    Message.find()
      .exec((error, messages) => {
        if (error) {
          reject({ errors: { ...error } });
        } else {
          resolve(messages);
        }
      });
  });
};

exports.createMessage = (message) => {
  return new Promise((resolve, reject) => {
    const newMessage = new Message({
      text: message.text
    });
    newMessage.save((error) => {
      if (error) {
        reject({ errors: { ...error } });
      }
      resolve(newMessage);
    });
  });
};
