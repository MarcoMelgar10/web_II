const postRepository = require("./post.repository");
const prisma = require("../../config/database");

const buildImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

const createPost = async (creatorId, data, req) => {
  const postData = { creatorId, text: data.text };
  if (req.file) {
    postData.imageUrl = buildImageUrl(req, req.file.filename);
  }
  return postRepository.create(postData);
};

const getPostsByCreator = async (creatorId, requesterId, requesterRole) => {
  if (requesterRole === "CREATOR" && requesterId === creatorId) {
    return postRepository.findByCreatorId(creatorId);
  }

  if (requesterRole === "FOLLOWER") {
    const donation = await prisma.donation.findFirst({
      where: { followerId: requesterId, creatorId },
    });

    if (!donation) {
      const err = new Error("You must donate at least one flan to view this creator's posts");
      err.statusCode = 403;
      throw err;
    }

    return postRepository.findByCreatorId(creatorId);
  }

  const err = new Error("Forbidden");
  err.statusCode = 403;
  throw err;
};

const getPostById = async (id, requesterId, requesterRole) => {
  const post = await postRepository.findById(id);
  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  if (requesterRole === "CREATOR" && requesterId === post.creatorId) {
    return post;
  }

  if (requesterRole === "FOLLOWER") {
    const donation = await prisma.donation.findFirst({
      where: { followerId: requesterId, creatorId: post.creatorId },
    });

    if (!donation) {
      const err = new Error("You must donate at least one flan to view this post");
      err.statusCode = 403;
      throw err;
    }
    return post;
  }

  const err = new Error("Forbidden");
  err.statusCode = 403;
  throw err;
};

const deletePost = async (id, creatorId) => {
  const post = await postRepository.findById(id);
  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }
  if (post.creatorId !== creatorId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  return postRepository.deleteById(id);
};

module.exports = { createPost, getPostsByCreator, getPostById, deletePost };
