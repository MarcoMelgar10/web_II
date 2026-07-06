const prisma = require("../../config/database");

const findByFollowerAndCreator = (followerId, creatorId) => {
  return prisma.favorite.findUnique({
    where: { followerId_creatorId: { followerId, creatorId } },
  });
};

const create = (data) => {
  return prisma.favorite.create({ data });
};

const deleteByFollowerAndCreator = (followerId, creatorId) => {
  return prisma.favorite.delete({
    where: { followerId_creatorId: { followerId, creatorId } },
  });
};

const findByFollowerId = (followerId) => {
  return prisma.favorite.findMany({
    where: { followerId },
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          id: true,
          creatorProfile: { select: { displayName: true, avatarUrl: true, bannerUrl: true } },
        },
      },
    },
  });
};

module.exports = { findByFollowerAndCreator, create, deleteByFollowerAndCreator, findByFollowerId };
