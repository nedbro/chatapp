const express = require("express");
const router = express.Router();
const conversationService = require("../services/conversationService");
const { body, validationResult, check } = require("express-validator");


router.get("/", (req, res, next) => {
  conversationService.getAllConversations().then(
    conversations => res.json(conversations),
    error => next(error)
  );
});

router.post("/", [
  body("users").isArray({ min: 2 }).withMessage("The provided user input is incorrect"),
  body("users.*").isString().withMessage("The provided user input is incorrect"),
  body("name").isString().trim().isLength({ min: 1 }),
  body("message").isString().trim().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      conversationService.createConversation(req.body).then(
        conversation => res.json(conversation),
        error => next(error)
      );
    } else {
      next(errors);
    }
  }
]);

router.delete("/:id", ((req, res, next) => {
  conversationService.deleteConversation(req.params.id).then(
    () => res.sendStatus(200),
    error => next(error)
  );
}));

module.exports = router;
