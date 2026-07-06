const prisma = require("../../config/database");

const getFeed = async (followerId) => {
  const donations = await prisma.donation.findMany({
    where: { followerId },
    select: { creatorId: true },
    distinct: ["creatorId"],
  });

  const creatorIds = donations.map((d) => d.creatorId);

  if (creatorIds.length === 0) return [];

  return prisma.post.findMany({
    where: { creatorId: { in: creatorIds } },
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          id: true,
          creatorProfile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
  });
};

module.exports = { getFeed };
