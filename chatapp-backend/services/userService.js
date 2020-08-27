const User = require("../models/user");

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .exec((error, users) => {
        if (error) {
          reject(error);
        } else {
          resolve(users);
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
    newUser.save((error) => {
      if (error) {
        reject(error);
      }
      resolve(newUser);
    });
  });
};
