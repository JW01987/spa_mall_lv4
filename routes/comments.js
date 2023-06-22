const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//게시글에 해당하는 댓글 조회
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const comment = await Comment.find({ postId });
  if (!comment.length) {
    return res
      .status(404)
      .json({ success: false, msg: "해당 게시글에 댓글이 없습니다." });
  }
  const sortedList = comment
    .sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .reverse();
  res.status(200).json({ success: true, sortedList });
});

//댓글 생성
router.post("/comments", async (req, res) => {
  const { postId, content } = req.body;
  if (!content.length) {
    return res
      .status(404)
      .json({ success: false, msg: "댓글 내용을 입력해주세요" });
  }
  //게시글 아이디가 존재하는지
  const postIdFind = await Post.find({ postId }, { password: 0 });
  if (!postIdFind.length) {
    return res
      .status(404)
      .json({ success: false, msg: "해당 게시글이 존재하지 않습니다." });
  }

  const maxOrderByCommentId = await Comment.findOne().sort("-commentId").exec();
  const commentId = maxOrderByCommentId ? maxOrderByCommentId.postId + 1 : 1;
  Comment.create({
    postId,
    content,
    commentId,
  });
  res.status(200).json({ success: true, msg: "댓글이 등록되었습니다." });
});

//댓글 수정
router.put("/comments", async (req, res) => {
  const { postId, content, commentId } = req.body;
  if (!content.length) {
    return res
      .status(404)
      .json({ success: false, msg: "댓글 내용을 입력해주세요." });
  }
  const comment = await Comment.findOneAndUpdate(
    { commentId, postId },
    { content },
    { new: true }
  );
  if (!comment) {
    return res.status(404).json({
      success: false,
      msg: "게시글id 혹은 댓글id가 일치하지 않습니다.",
    });
  }
  res.status(200).json({ success: true, msg: "댓글이 수정되었습니다." });
});

//댓글 삭제
router.delete("/comments", async (req, res) => {
  const { commentId } = req.body;
  const comment = await Comment.findOneAndDelete({ commentId });
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, msg: "해당 댓글이 없습니다." });
  }
  res.status(200).json({ success: true, msg: "댓글이 삭제되었습니다." });
});
module.exports = router;
