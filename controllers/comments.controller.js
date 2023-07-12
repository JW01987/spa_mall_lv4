const CommentService = require("../services/comments.services");
class CommentsController {
  commentService = new CommentService();

  getAllComment = async (req, res, next) => {
    const comments = await this.commentService.getAllComment();
    res.status(200).json({ success: true, comments });
  };
  createComment = async (req, res, next) => {
    const { content, postId } = req.body;
    const { id } = res.locals.user;
    await this.commentService.createComment(postId, content, id);
    res.status(200).json({ success: true, msg: "댓글이 등록되었습니다." });
  };
  updateComment = async (req, res, next) => {
    const { postId, content, commentId } = req.body;
    const { id } = res.locals.user;
    await this.commentService.updateComment(postId, content, id, commentId);
    res.status(200).json({ success: true, msg: "댓글이 수정되었습니다." });
  };
  deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { id } = res.locals.user;
    await this.commentService.deleteComment(id, commentId);
    res.status(200).json({ success: true, msg: "댓글이 삭제되었습니다." });
  };
}

module.exports = CommentsController;
