const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const conversationService = require("../services/conversationService");
const { checkNotAuthenticated } = require("../services/loginService");
const { checkAuthenticated } = require("../services/loginService");
const { body, validationResult, check } = require("express-validator");

/* GET users listing. */
router.get("/", checkAuthenticated, (req, res, next) => {
  userService.getAllUsers().then(
    (users) => res.json(users),
    (error) => next(error)
  );
});

router.post("/", [
  checkNotAuthenticated,
  body("username").trim().isLength({ min: 1, max: 15 }),
  body("password").trim().isLength({ min: 1 }),
  check("*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      userService.createUser(req.body).then(
        (user) => {
          req.login(user, (error) => {
            if (error) {
              return next(error);
            }
            res.json(user);
          });
          
        },
        (error) => next(error)
      );
    } else {
      next(errors);
    }
  },
]);

router.get("/:id/conversations", [
  checkAuthenticated,
  async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      const conversations = await conversationService.getConversationsOfUser(
        user
      );
      res.json(conversations);
    } catch (error) {
      next(error);
    }
  },
]);

router.get("/:id/newConversations", [
  checkAuthenticated,
  (req, res, next) => {
    const { page = 1, limit = 20 } = req.query;
    userService
      .getNewUsersForConversations(req.params.id,page, limit)
      .then((users) => res.json(users))
      .catch((error) => next(error));
  },
]);

module.exports = router;
