const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");

//전체 게시글 조회
router.get("/posts", async (req, res) => {
  const post = await Posts.findAll({
    attributes: ["postId", "title", "nickname"],
    order: [["createdAt", "DESC"]],
  });
  if (!post.length) {
    return res
      .status(404)
      .json({ success: false, msg: "데이터를 불러올 수 없습니다." });
  }

  res.status(200).json({ success: true, sortedList });
});

//게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    where: { postId },
  });
  if (!post) {
    return res
      .status(404)
      .json({ success: false, msg: "데이터를 불러올 수 없습니다." });
  }

  res.status(200).json({ post });
});

//게시글 생성
router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { nickname } = res.locals.user;
  if (!content || !title) {
    return res
      .status(404)
      .json({ success: false, msg: "내용을 추가해 주세요." });
  }
  Posts.create({
    title,
    nickname,
    content,
  });

  res.status(200).json({ success: true, msg: "게시글이 저장되었습니다." });
});

//게시글 수정
router.put("/post", authMiddleware, async (req, res) => {
  const { postId, title, content } = req.body;
  const { nickname } = res.locals.user;
  if (!content || !title) {
    return res
      .status(404)
      .json({ success: false, msg: "내용이나 제목을 추가해 주세요." });
  }
  try {
    const checkPostId = await Posts.findOne({ where: { postId } });
    if (checkPostId.nickname !== nickname) {
      return res
        .status(404)
        .json({ success: false, msg: "작성자만 수정 할 수 있습니다." });
    }
  } catch {
    return res
      .status(404)
      .json({ success: false, msg: "게시글을 찾을 수 없습니다." });
  }
  await Posts.update(
    { title, content }, // title과 content 컬럼을 수정합니다.
    {
      where: {
        [Op.and]: [{ postId }, { nickname }],
      },
    }
  );
  res.status(200).json({ success: true, msg: "게시글이 수정되었습니다." });
});

//게시글 삭제
router.delete("/post/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { nickname } = res.locals.user;
  try {
    const checkPostId = await Posts.findOne({ postId });
    if (checkPostId.nickname !== nickname) {
      return res
        .status(404)
        .json({ success: false, msg: "작성자만 삭제 할 수 있습니다." });
    }
  } catch {
    return res
      .status(404)
      .json({ success: false, msg: "게시글을 찾을 수 없습니다." });
  }
  await Posts.destroy({
    where: {
      [Op.and]: [{ postId }, { nickname }],
    },
  });
  res.status(200).json({ success: true, msg: "게시글이 삭제되었습니다." });
});

module.exports = router;
