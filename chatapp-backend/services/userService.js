const User = require("../models/user");
const Conversation = require("../models/conversation");
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

exports.getNewUsersForConversations = (userId) => {
  return new Promise(async (resolve, reject) => {
    let currentUser;
    try {
      currentUser = await this.getUserById(userId);
    } catch (error) {
      reject(error);
      return;
    }

    if (currentUser === null || currentUser === undefined) {
      reject({ message: "User not found" });
      return;
    }
    Conversation
      .find({ "participants": currentUser })
      .populate("participants")
      .exec((error, conversations) => {
        if (error) {
          reject({ errors: error });
          return;
        }

        if (conversations) {
          let usersToRemove = new Set();

          conversations.forEach(conversation => conversation.participants.forEach(user => usersToRemove.add(user)));
          usersToRemove.add(currentUser);
          usersToRemove = [...usersToRemove];

          User.find().exec((error, users) => {
            if (error) {
              reject(error);
              return;
            }

            if (users) {
              const filteredUsers = users.filter(user => !usersToRemove.some(element => element._id.toString() === user._id.toString()));
              resolve(filteredUsers);
            }
          });
        }
      });
  });
};


