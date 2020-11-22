const User = require("../models/user");
const Conversation = require("../models/conversation");
const bcrypt = require("bcrypt");

exports.getAllUsers = async () => {
  return await User.find();
};

exports.createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    username: user.username,
    password: hashedPassword
  });
  await newUser.save();
  return newUser;
};

exports.getUserByUsername = async (username) => {
  return User.findOne({ username: username });
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.getNewUsersForConversations = async (userId, page) => {
  const currentUser = await this.getUserById(userId);

  if (currentUser === null || currentUser === undefined) {
    throw { message: "User not found" };
  }

  const conversationsOfTheCurrentUser = await Conversation
    .find({ "participants": currentUser })
    .populate("participants");

  if (conversationsOfTheCurrentUser) {
    let usersToRemove = new Set();

    conversationsOfTheCurrentUser.forEach(conversation => conversation.participants.forEach(user => usersToRemove.add(user)));
    usersToRemove.add(currentUser);
    usersToRemove = [...usersToRemove];

    const allUsers = await User.find();
    if (allUsers) {
      const filteredUsers = allUsers.filter(user => !usersToRemove.some(element => element._id.toString() === user._id.toString()));
      return filteredUsers;
    }
    throw { message: "An unexpected error happened" };
  }
};


