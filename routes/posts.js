const express = require("express");
const router = express.Router();
const { Posts, Users, Likes } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const { Op, Sequelize } = require("sequelize");

//전체 게시글 조회
router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: [
        "id",
        "title",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Posts.id)"
          ),
          "likesCount",
        ],
      ],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Users, // join할 모델
          attributes: ["nickname"], // select해서 표시할 필드 지정
        },
      ],
    });
    if (!posts.length) {
      return res
        .status(404)
        .json({ success: false, msg: "게시글을 불러올 수 없습니다." });
    }
    res.status(200).json({ posts });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});
//게시글 상세 조회
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      attributes: [
        "id",
        "title",
        "content",
        "createdAt",
        "updatedAt",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Posts.id)"
          ),
          "likesCount",
        ],
      ],
      where: { id: postId },
    });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, msg: "데이터를 불러올 수 없습니다." });
    }

    res.status(200).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, errorMessage: err.message });
  }
});
//게시글 생성
router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { id } = res.locals.user;
  if (!content || !title) {
    return res
      .status(404)
      .json({ success: false, msg: "내용을 추가해 주세요." });
  }
  try {
    Posts.create({
      title,
      userId: id,
      content,
    });

    res.status(200).json({ success: true, msg: "게시글이 저장되었습니다." });
  } catch (err) {
    res.status(500).json({ success: false, errorMessage: err.message });
  }
});

//게시글 수정
router.put("/post", authMiddleware, async (req, res) => {
  const { postId, title, content } = req.body;
  const { id } = res.locals.user;
  if (!content || !title) {
    return res
      .status(404)
      .json({ success: false, msg: "내용이나 제목을 추가해 주세요." });
  }
  try {
    const checkPostId = await Posts.findOne({ where: { id: postId } });
    if (checkPostId.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "게시글을 찾을 수 없습니다." });
    }
    if (checkPostId.userId !== id) {
      return res
        .status(404)
        .json({ success: false, msg: "작성자만 수정 할 수 있습니다." });
    }
    await Posts.update(
      { title, content }, // title과 content 컬럼을 수정합니다.
      {
        where: {
          [Op.and]: [{ id: postId }, { userId: id }],
        },
      }
    );
    res.status(200).json({ success: true, msg: "게시글이 수정되었습니다." });
  } catch (err) {
    res.status(500).json({ success: false, errorMessage: err.message });
  }
});

//게시글 삭제
router.delete("/post/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { id } = res.locals.user;
  try {
    const checkPostId = await Posts.findOne({ id: postId });
    if (checkPostId.userId !== id) {
      return res
        .status(403)
        .json({ success: false, msg: "작성자만 삭제 할 수 있습니다." });
    }
    await Posts.destroy({
      where: {
        [Op.and]: [{ id: postId }, { userId: id }],
      },
    });
    res.status(200).json({ success: true, msg: "게시글이 삭제되었습니다." });
  } catch (err) {
    res.status(500).json({ success: false, errorMessage: err.message });
  }
});

//좋아요 조회
router.get("/posts/likes", authMiddleware, async (req, res) => {
  const { id } = res.locals.user;
  try {
    // 사용자가 좋아요한 게시글 조회
    //(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Posts.id)였을때는 오류 났다가
    //(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)는 오류 안 남...
    const likedPosts = await Likes.findAll({
      attributes: [
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)"
          ),
          "likesCount",
        ],
      ],
      where: { userId: id },
      include: [
        {
          model: Posts,
          attributes: ["title", "content"],
        },
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
    });

    res.status(200).json({ likedPosts });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});
//좋아요 기능
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { id } = res.locals.user;
  try {
    const checkLike = await Likes.findOne({
      attributes: ["id"],
      where: { postId, userId: id },
    });
    console.log(checkLike);
    if (checkLike) {
      await Likes.destroy({
        where: {
          postId,
          userId: id,
        },
      });
      return res
        .status(200)
        .json({ success: true, msg: "좋아요가 취소되었습니다." });
    }
    await Likes.create({
      postId,
      userId: id,
    });
    res.status(200).json({ success: true, msg: "좋아요가 추가되었습니다" });
  } catch (err) {
    res.status(500).json({ success: false, errorMessage: err.message });
  }
});

module.exports = router;
