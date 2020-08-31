const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .exec((error, users) => {
        if (error) {
          reject({ errors: { ...error } });
        } else {
          resolve(users);
        }
      });
  });
};

exports.createUser = (user) => {
  return new Promise(async (resolve, reject) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      username: user.username,
      password: hashedPassword
    });
    newUser.save((error) => {
      if (error) {
        reject({ errors: { ...error } });
      }
      resolve(newUser);
    });
  });
};

exports.getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({ username: username })
      .exec((error, user) => {
        if (error) {
          reject({ errors: { ...error } });
        } else {
          resolve(user);
        }
      });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .exec((error, users) => {
        if (error) {
          reject({ errors: { ...error } });
        } else {
          resolve(users);
        }
      });
  });
};
