const prisma = require("../../config/database");

const create = (data) => {
  return prisma.donation.create({
    data,
    include: {
      creator: { select: { id: true, creatorProfile: { select: { displayName: true } } } },
      follower: { select: { id: true, email: true } },
    },
  });
};

const findByFollowerId = ({ followerId, from, to, creatorName }) => {
  const where = { followerId };

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  return prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          id: true,
          creatorProfile: { select: { displayName: true } },
        },
      },
    },
  });
};

const findByCreatorId = ({ creatorId, from, to }) => {
  const where = { creatorId };

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  return prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      follower: { select: { id: true, email: true } },
    },
  });
};

const sumFlanesByCreatorId = async ({ creatorId, from, to }) => {
  const where = { creatorId };

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const result = await prisma.donation.aggregate({
    where,
    _sum: { flanes: true },
  });

  return result._sum.flanes || 0;
};

module.exports = { create, findByFollowerId, findByCreatorId, sumFlanesByCreatorId };
