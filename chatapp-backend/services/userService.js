const User = require("../models/user");

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .exec((error, messages) => {
        if (error) {
          reject(error);
        } else {
          resolve(messages);
        }
      });
  });
};

exports.createUser = (user) => {
  return new Promise((resolve, reject) => {
    const newUser = new User({
      username: user.username,
      password: user.password
    });
    newUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(newUser);
    });
  });
};
