const prisma = require("../../config/database");

const create = (data) => {
  return prisma.post.create({
    data,
    include: {
      creator: { select: { id: true, creatorProfile: { select: { displayName: true, avatarUrl: true } } } },
    },
  });
};

const findByCreatorId = (creatorId) => {
  return prisma.post.findMany({
    where: { creatorId },
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { id: true, creatorProfile: { select: { displayName: true, avatarUrl: true } } } },
      comments: {
        include: { follower: { select: { id: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

const findById = (id) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, creatorProfile: { select: { displayName: true, avatarUrl: true } } } },
      comments: {
        include: { follower: { select: { id: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

const findByCreatorIds = (creatorIds) => {
  return prisma.post.findMany({
    where: { creatorId: { in: creatorIds } },
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { id: true, creatorProfile: { select: { displayName: true, avatarUrl: true } } } },
    },
  });
};

const deleteById = (id) => {
  return prisma.post.delete({ where: { id } });
};

module.exports = { create, findByCreatorId, findById, findByCreatorIds, deleteById };
