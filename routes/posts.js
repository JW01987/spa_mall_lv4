const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");

//전체 게시글 조회
router.get("/posts", async (req, res) => {
  const post = await Post.find({}, { password: 0 });
  if (!post.length) {
    return res
      .status(404)
      .json({ success: false, msg: "데이터를 불러올 수 없습니다." });
  }
  //정렬하기
  const sortedList = post.sort(function (a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  res.status(200).json({ success: true, sortedList });
});

//게시글 검색 조회
router.get("/posts", async (req, res) => {
  const { searchWord, searchData } = req.query;
  //키 값으로 변수를 넣고싶을때는 []로 감싸준다
  const post = await Post.find({ [searchWord]: searchData }, { password: 0 });
  if (!post) {
    return res
      .status(404)
      .json({ success: false, msg: "데이터를 불러올 수 없습니다." });
  }

  res.status(200).json({ post });
});

//게시글 생성
router.post("/posts", async (req, res) => {
  const { title, writer, content, password } = req.body;
  if (!content || !title || !writer || !password) {
    return res
      .status(404)
      .json({ success: false, msg: "내용을 추가해 주세요." });
  }

  const maxOrderByPostId = await Post.findOne().sort("-postId").exec();
  const newPostId = maxOrderByPostId ? maxOrderByPostId.postId + 1 : 1;

  Post.create({
    title,
    writer,
    content,
    password,
    newPostId,
  });

  res.status(200).json({ success: true, msg: "게시글이 저장되었습니다." });
});

//게시글 수정
router.put("/post", async (req, res) => {
  const { postId, title, writer, content, password } = req.body;
  if (!content) {
    return res
      .status(404)
      .json({ success: false, msg: "내용을 추가해 주세요." });
  }
  const post = await Post.findOneAndUpdate(
    { postId, password },
    { title, writer, content },
    { new: true }
  );
  if (!post) {
    return res.status(404).json({
      success: false,
      msg: "해당 게시글이 없거나 비밀번호가 잘못되었습니다.",
    });
  }
  res.status(200).json({ success: true, msg: "게시글이 수정되었습니다." });
});

//게시글 삭제
router.delete("/post", async (req, res) => {
  const { postId, password } = req.body;
  const post = await Post.findOneAndDelete({ postId, password });
  if (!post) {
    return res.status(404).json({
      success: false,
      msg: "해당 게시글이 없거나 비밀번호가 잘못되었습니다.",
    });
  }
  res.status(200).json({ success: true, msg: "게시글이 삭제되었습니다." });
});

module.exports = router;
