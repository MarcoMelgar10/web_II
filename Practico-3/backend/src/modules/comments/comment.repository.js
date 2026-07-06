const prisma = require("../../config/database");

const create = (data) => {
  return prisma.comment.create({
    data,
    include: { follower: { select: { id: true, email: true } } },
  });
};

const findByPostId = (postId) => {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: { follower: { select: { id: true, email: true } } },
  });
};

module.exports = { create, findByPostId };
