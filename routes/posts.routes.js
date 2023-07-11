const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

router.get("/posts", postsController.getAllPosts);
router.get("/posts/:postId", postsController.getDetailPost);
router.post("/posts", authMiddleware, postsController.createPost);
router.put("/post", authMiddleware, postsController.updatePost);
router.delete("/post/:postId", authMiddleware, postsController.deletePost);
router.get("/post/likes", authMiddleware, postsController.likePosts);
router.put("/post/:postId/likes", authMiddleware, postsController.checkLike);

module.exports = router;
