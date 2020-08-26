const Message = require("../models/message");

exports.getAllMessages = () => {
  return new Promise((resolve, reject) => {
    Message.find()
      .exec((error, messages) => {
        if (error) {
          reject(error);
        } else {
          resolve(messages);
        }
      });
  });
};

exports.createMessage = (req) => {
  return new Promise((resolve, reject) => {
    const newMessage = new Message({
      text: req.body.text
    });
    newMessage.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(newMessage);
    });
  });
};
