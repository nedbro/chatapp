const express = require("express");
const router = express.Router();
const messageService = require("../services/messageService");
const { checkAuthenticated } = require("../services/loginService");
const { body, validationResult, check } = require("express-validator");

router.get("/", checkAuthenticated, (req, res, next) => {
  messageService.getAllMessages().then(
    messages => res.json(messages),
    error => next(error)
  );
});

// router.post("/", [
//   body("text").trim().isLength({ min: 1 }),
//   check("*").escape(),
//
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       messageService.createMessage(req.body).then(
//         (message) => res.json(message),
//         (error) => {
//           next(error);
//         }
//       );
//     } else {
//       next(errors);
//     }
//   }
// ]);

module.exports = router;
