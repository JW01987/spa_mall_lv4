const PostRepository = require("../repositories/posts.repository");

class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();
    return allPost;
  };

  findPostById = async (postId) => {
    const findPost = await this.postRepository.findPostById(postId);
    //likesCount가 findPost 객체의 직접적인 속성으로 정의되어 있지 않기 때문에 dataValues를 써줘야함
    return {
      postId: findPost.id,
      nickname: findPost.User.nickname,
      title: findPost.title,
      content: findPost.content,
      like: findPost.dataValues.likesCount,
    };
  };

  createPost = async (title, content, id) => {
    await this.postRepository.createPost(title, content, id);
  };

  updatePost = async (postId, title, content, id) => {
    const findPostCheck = await this.postRepository.findPostById(postId);
    if (findPostCheck.length === 0)
      throw new Error("게시글을 찾을 수 없습니다.");

    if (findPostCheck.id !== id)
      throw new Error("작성자만 수정 할 수 있습니다.");

    await this.postRepository.updatePost(postId, title, content, id);

    const findPost = await this.postRepository.findPostById(postId);

    return {
      postId: findPost.id,
      nickname: findPost.User.nickname,
      title: findPost.title,
      content: findPost.content,
      like: findPost.dataValues.likesCount,
    };
  };

  deletePost = async (postId, id) => {
    const findPostCheck = await this.postRepository.findPostById(postId);
    if (findPostCheck.length === 0)
      throw new Error("게시글을 찾을 수 없습니다.");

    if (findPostCheck.id !== id)
      throw new Error("작성자만 수정 할 수 있습니다.");

    await this.postRepository.deletePost(postId, id);
  };
  likePosts = async (id) => {
    const findPost = await this.postRepository.findLikePost(id);
    if (findPost.length === 0)
      return { success: false, msg: "좋아요 게시글이 없습니다" };
    return {
      postId: findPost.Post.id,
      nickname: findPost.User.nickname,
      title: findPost.Post.title,
      content: findPost.Post.content,
      like: findPost.dataValues.likesCount,
    };
  };
  checkLike = async (postId, id) => {
    const findPostCheck = await this.postRepository.findPostById(postId);
    if (findPostCheck.length === 0) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    const checkLike = await this.postRepository.checkLike(postId, id);
    if (checkLike) {
      await this.postRepository.deleteLike(postId, id);
      return { msg: "좋아요가 취소되었습니다" };
    } else {
      await this.postRepository.addLike(postId, id);
      return { msg: "좋아요가 등록되었습니다" };
    }
  };
}

module.exports = PostService;
