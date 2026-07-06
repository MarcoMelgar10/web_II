const commentService = require("./comment.service");
const { success, created } = require("../../utils/response");

const add = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(req.user.id, req.body);
    return created(res, comment, "Comment added");
  } catch (err) {
    next(err);
  }
};

const getByPost = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    return success(res, comments);
  } catch (err) {
    next(err);
  }
};

module.exports = { add, getByPost };
