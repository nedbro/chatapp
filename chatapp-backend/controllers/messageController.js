const express = require("express");
const router = express.Router();
const messageService = require("../services/messageService");
const { checkAuthenticated } = require("../services/loginService");
const { body, validationResult, check } = require("express-validator");
const Message = require("../models/message");

router.get("/", checkAuthenticated, (req, res, next) => {
  messageService.getAllMessages().then(
    (messages) => res.json(messages),
    (error) => next(error)
  );
});

router.get("/ofConversation/:conversationId", checkAuthenticated, async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  try {
    // execute query with page and limit values
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .sort({ sent_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection
    const count = await Message.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      messages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
  }
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
