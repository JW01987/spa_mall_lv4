const express = require("express");
const router = express.Router();
const { Posts, Users, Likes } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const { Op, Sequelize } = require("sequelize");
const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

router.get("/posts", postsController.getAllPosts);
router.get("/posts/:postId", postsController.getDetailPost);
router.post("/posts", authMiddleware, postsController.createPost);
router.put("/post", authMiddleware, postsController.updatePost);
router.delete("/post/:postId", authMiddleware, postsController.deletePost);
router.get("/post/likes", authMiddleware, postsController.likePosts);
router.put("/post/:postId/likes", authMiddleware, postsController.checkLike);

// //좋아요 기능
// router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
//   const { postId } = req.params;
//   const { id } = res.locals.user;
//   try {
//     const checkLike = await Likes.findOne({
//       attributes: ["id"],
//       where: { postId, userId: id },
//     });
//     console.log(checkLike);
//     if (checkLike) {
//       await Likes.destroy({
//         where: {
//           postId,
//           userId: id,
//         },
//       });
//       return res
//         .status(200)
//         .json({ success: true, msg: "좋아요가 취소되었습니다." });
//     }
//     await Likes.create({
//       postId,
//       userId: id,
//     });
//     res.status(200).json({ success: true, msg: "좋아요가 추가되었습니다" });
//   } catch (err) {
//     res.status(500).json({ success: false, errorMessage: err.message });
//   }
// });

module.exports = router;
