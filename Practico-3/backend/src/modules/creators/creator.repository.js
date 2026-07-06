const prisma = require("../../config/database");

const findAllWithProfile = () => {
  return prisma.user.findMany({
    where: { role: "CREATOR" },
    select: {
      id: true,
      creatorProfile: { select: { displayName: true, avatarUrl: true, bannerUrl: true, bio: true } },
    },
    orderBy: { creatorProfile: { displayName: "asc" } },
  });
};

const searchByName = (query) => {
  return prisma.user.findMany({
    where: {
      role: "CREATOR",
      creatorProfile: {
        displayName: { contains: query, mode: "insensitive" },
      },
    },
    select: {
      id: true,
      creatorProfile: { select: { displayName: true, avatarUrl: true, bannerUrl: true, bio: true } },
    },
    orderBy: { creatorProfile: { displayName: "asc" } },
  });
};

const findPublicProfile = (creatorId) => {
  return prisma.user.findUnique({
    where: { id: creatorId, role: "CREATOR" },
    select: {
      id: true,
      creatorProfile: {
        select: { displayName: true, avatarUrl: true, bannerUrl: true, bio: true },
      },
      goals: { orderBy: { createdAt: "desc" } },
    },
  });
};

module.exports = { findAllWithProfile, searchByName, findPublicProfile };
