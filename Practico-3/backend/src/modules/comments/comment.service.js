const commentRepository = require("./comment.repository");
const prisma = require("../../config/database");

const addComment = async (followerId, { postId, text }) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  const donation = await prisma.donation.findFirst({
    where: { followerId, creatorId: post.creatorId },
  });

  if (!donation) {
    const err = new Error("You must donate to this creator before leaving a comment");
    err.statusCode = 403;
    throw err;
  }

  return commentRepository.create({ followerId, postId, text });
};

const getCommentsByPost = (postId) => {
  return commentRepository.findByPostId(postId);
};

module.exports = { addComment, getCommentsByPost };
