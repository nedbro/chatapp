const express = require("express");
const passport = require("passport");
const { checkNotAuthenticated } = require("../services/loginService");
const { checkAuthenticated } = require("../services/loginService");
const router = express.Router();

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local"),
  (req, res, next) => {
    res.json({ username: req.user.username, _id: req.user["_id"] });
  }
);

router.delete("/logout", checkAuthenticated, (req, res, next) => {
  req.logout();
  res.sendStatus(200);
});

router.get("/me", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ username: req.user.username, _id: req.user["_id"] });
  } else {
    res.status(404);
  }
});

module.exports = router;
