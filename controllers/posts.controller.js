const PostService = require("../services/posts.services");
class PostsController {
  postService = new PostService();

  //전체 게시글 조회
  getAllPosts = async (req, res, next) => {
    const posts = await this.postService.findAllPost();
    res.status(200).json({ success: true, posts });
  };
  //게시글 상세 조회
  getDetailPost = async (req, res, next) => {
    const { postId } = req.params;
    const posts = await this.postService.findPostById(postId);
    res.status(200).json({ success: true, posts });
  };
  //게시글 생성
  createPost = async (req, res, next) => {
    const { title, content } = req.body;
    const { id } = res.locals.user;
    await this.postService.createPost(title, content, id);

    res.status(201).json({ success: true, msg: "게시글이 저장되었습니다." });
  };
  //게시글 수정
  updatePost = async (req, res, next) => {
    const { postId, title, content } = req.body;
    const { id } = res.locals.user;
    await this.postService.updatePost(postId, title, content, id);

    res.status(201).json({ success: true, msg: "게시글이 저장되었습니다." });
  };
  //게시글 삭제
  deletePost = async (req, res, next) => {
    const { postId } = req.params;
    const { id } = res.locals.user;
    await this.postService.deletePost(postId, id);

    res.status(201).json({ success: true, msg: "게시글이 삭제되었습니다." });
  };
  //좋아요 조회
  likePosts = async (req, res, next) => {
    const { id } = res.locals.user;
    const posts = await this.postService.likePosts(id);
    res.status(posts.status).json({ msg });
  };
  checkLike = async (req, res, next) => {
    const { postId } = req.params;
    const { id } = res.locals.user;
    const checkLike = await this.postService.checkLike(postId, id);
    res.status(200).json({ checkLike });
  };
}

module.exports = PostsController;
