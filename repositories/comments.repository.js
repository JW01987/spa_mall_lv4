const { Users, Comments } = require("../models");
const { Op } = require("sequelize");

class CommentRepository {
  findAllComment = async () => {
    const comment = await Comments.findAll({
      attributes: ["id", "content"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
    });
    return comment;
  };
  createComment = async (postId, content, id) => {
    await Comments.create({
      postId,
      content,
      userId: id,
    });
  };
  updateComment = async (postId, content, id, commentId) => {
    await Comments.update(
      { content },
      {
        where: {
          [Op.and]: [{ id: commentId }, { userId: id }, { postId }],
        },
      }
    );
  };
  deleteComment = async (id, commentId) => {
    await Comments.destroy({
      where: {
        [Op.and]: [{ id: commentId }, { userId: id }],
      },
    });
  };
}
module.exports = CommentRepository;
