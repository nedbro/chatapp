const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const { body, validationResult, check } = require("express-validator");


/* GET users listing. */
router.get("/", (req, res, next) => {
  userService.getAllUsers().then(
    users => res.json(users),
    error => next(error)
  );
});

router.post("/", [
  body("username").trim().isLength({ min: 1, max: 15 }),
  body("password").trim().isLength({ min: 1 }),
  check("*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      userService.createUser(req.body).then(
        user => res.json(user),
        error => next(error)
      );
    } else {
      next(errors);
    }
  }

]);

module.exports = router;
