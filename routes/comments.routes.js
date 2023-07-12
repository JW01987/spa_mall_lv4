const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

router.get("/comments", commentsController.getAllComment);
router.post("/comments", authMiddleware, commentsController.createComment);
router.put("/comments", authMiddleware, commentsController.updateComment);
router.delete(
  "/comments/:commentId",
  authMiddleware,
  commentsController.deleteComment
);
module.exports = router;
