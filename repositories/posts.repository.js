const { Posts, Users, Likes } = require("../models");
const { Sequelize, Op } = require("sequelize");
class PostRepository {
  findAllPost = async () => {
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
          model: Users,
          attributes: ["nickname", "id"],
        },
      ],
    });
    return posts;
  };

  findPostById = async (postId) => {
    const post = await Posts.findOne({
      attributes: [
        "id",
        "title",
        "content",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Posts.id)"
          ),
          "likesCount",
        ],
      ],
      where: { id: postId },
      include: [
        {
          model: Users,
          attributes: ["nickname", "id"],
        },
      ],
    });
    return post;
  };

  createPost = async (title, content, id) => {
    await Posts.create({
      title,
      userId: id,
      content,
    });
  };

  updatePost = async (postId, title, content, id) => {
    await Posts.update(
      { title, content },
      {
        where: {
          [Op.and]: [{ id: postId }, { userId: id }],
        },
      }
    );
  };

  deletePost = async (postId, id) => {
    await Posts.destroy({
      where: {
        [Op.and]: [{ id: postId }, { userId: id }],
      },
    });
  };
  findLikePost = async (id) => {
    const posts = await Likes.findAll({
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
          attributes: ["title", "content", "id"],
        },
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
    });
    return posts;
  };
  checkLike = async (postId, id) => {
    const checkLike = await Likes.findOne({
      attributes: ["id"],
      where: { postId, userId: id },
    });
    return checkLike;
  };
  addLike = async (postId, id) => {
    await Likes.create({
      postId,
      userId: id,
    });
  };
  deleteLike = async (postId, id) => {
    await Likes.destroy({
      where: {
        postId,
        userId: id,
      },
    });
  };
}

module.exports = PostRepository;
