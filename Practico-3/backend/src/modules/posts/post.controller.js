const postService = require("./post.service");
const { success, created } = require("../../utils/response");

const create = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user.id, req.body, req);
    return created(res, post, "Post created");
  } catch (err) {
    next(err);
  }
};

const getByCreator = async (req, res, next) => {
  try {
    const posts = await postService.getPostsByCreator(
      req.params.creatorId,
      req.user.id,
      req.user.role
    );
    return success(res, posts);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id, req.user.id, req.user.role);
    return success(res, post);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user.id);
    return success(res, null, "Post deleted");
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getByCreator, getById, remove };
