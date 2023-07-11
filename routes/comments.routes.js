const { Posts, Comments, Users } = require("../models");
const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const { Op } = require("sequelize");
const CommentsController = require("../controllers/posts.controller");
const commentsController = new CommentsController();

router.get("/comments", commentsController.getAllComment);
//댓글 조회
// router.get("/comments", async (req, res) => {
//   try {
//     const comment = await Comments.findAll({
//       attributes: ["id", "content"],
//       order: [["createdAt", "DESC"]],
//       include: [
//         {
//           // 시퀄라이즈 조인은 기본 inner join
//           model: Users, // join할 모델
//           attributes: ["nickname"], // select해서 표시할 필드 지정
//         },
//       ],
//     });
//     if (!comment.length) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "데이터를 불러올 수 없습니다." });
//     }
//     res.status(200).json({ success: true, comment });
//   } catch (err) {
//     res.status(500).json({ success: false, errorMessage: err.message });
//   }
// });
// //댓글 생성
// router.post("/comments", authMiddleware, async (req, res) => {
//   const { content, postId } = req.body;
//   const { id } = res.locals.user;
//   if (!content.length) {
//     return res
//       .status(404)
//       .json({ success: false, msg: "댓글 내용을 입력해주세요" });
//   }
//   try {
//     const postIdCheck = await Posts.findOne({ where: { id: postId } });
//     if (!postIdCheck) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "해당 게시글이 없습니다." });
//     }
//     await Comments.create({
//       postId,
//       content,
//       userId: id,
//     });
//     res.status(200).json({ success: true, msg: "댓글이 등록되었습니다." });
//   } catch (err) {
//     return res.status(400).json({ success: false, errorMessage: err.message });
//   }
// });

// //댓글 수정
// router.put("/comments", authMiddleware, async (req, res) => {
//   const { postId, content, commentId } = req.body;
//   const { id } = res.locals.user;
//   if (!content.length) {
//     return res
//       .status(404)
//       .json({ success: false, msg: "댓글 내용을 입력해주세요." });
//   }
//   try {
//     const postIdCheck = await Posts.findOne({ where: { id: postId } });
//     if (!postIdCheck) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "해당 게시글이 없습니다." });
//     }

//     const comment = await Comments.findOne({ where: { id: commentId } });
//     if (comment.userId !== id) {
//       return res
//         .status(403)
//         .json({ success: false, msg: "작성자만 수정할 수 있습니다." });
//     }
//     if (comment.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "댓글을 찾을 수 없습니다." });
//     }

//     await Comments.update(
//       { content }, // title과 content 컬럼을 수정합니다.
//       {
//         where: {
//           [Op.and]: [{ id: commentId }, { userId: id }, { postId }],
//         },
//       }
//     );
//     res.status(200).json({ success: true, msg: "댓글이 수정되었습니다." });
//   } catch (err) {
//     return res.status(400).json({ success: false, errorMessage: err.message });
//   }
// });

// //댓글 삭제
// router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
//   const { commentId } = req.params;
//   const { id } = res.locals.user;
//   try {
//     const comment = await Comments.findOne({ where: { id: commentId } });

//     if (comment.userId !== id) {
//       return res
//         .status(403)
//         .json({ success: false, msg: "작성자만 삭제할 수 있습니다." });
//     }
//     if (comment.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "댓글을 찾을 수 없습니다." });
//     }
//     await Comments.destroy({
//       where: {
//         [Op.and]: [{ id: commentId }],
//       },
//     });
//     res.status(200).json({ success: true, msg: "댓글이 삭제되었습니다." });
//   } catch (err) {
//     return res.status(400).json({ success: false, errorMessage: err.message });
//   }
// });
module.exports = router;
