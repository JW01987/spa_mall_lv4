const CommentService = require("../services/comments.services");
class CommentsController {
  commentService = new CommentService();

  getAllComment = async (req, res, next) => {
    const comments = await this.commentService.getAllComment();
    res.status(200).json({ success: true, comments });
  };
}

module.exports = CommentsController;
