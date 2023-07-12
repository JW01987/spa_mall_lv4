const CommentRepository = require("../repositories/comments.repository");

class PostService {
  commentRepository = new CommentRepository();
  getAllComment = async () => {
    const comment = await this.commentRepository.findAllComment();
    if (comment.length === 0) throw new Error("데이터를 불러올 수 없습니다.");
    return comment;
  };
  createComment = async (postId, content, id) => {
    if (!content.length) throw new Error("댓글 내용을 입력해주세요");
    await this.commentRepository.createComment(postId, content, id);
  };
  updateComment = async (postId, content, id, commentId) => {
    if (!content.length) throw new Error("댓글 내용을 입력해주세요");
    await this.commentRepository.updateComment(postId, content, id, commentId);
  };
  deleteComment = async (id, commentId) => {
    await this.commentRepository.deleteComment(id, commentId);
  };
}

module.exports = PostService;
