const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getUserById } = require("../services/userService");
const { getUserByUsername } = require("../services/userService");


const initialize = (passport) => {
  passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser));
  passport.serializeUser((user, done) => {
    done(null, user["_id"]);
  });
  passport.deserializeUser((id, done) => {
    done(null, getUserById(id));
  });
};

const authenticateUser = async (username, password, done) => {

  const user = await getUserByUsername(username);

  if (user === undefined || user === null) {
    return done(null, false, { message: "User not found" });
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "The password is incorrect" });
    }
  } catch (error) {
    return done(error);
  }
};

module.exports = initialize;
