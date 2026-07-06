const prisma = require("../../config/database");

const findByUserId = (userId) => {
  return prisma.creatorProfile.findUnique({ where: { userId } });
};

const create = (data) => {
  return prisma.creatorProfile.create({ data });
};

const update = (userId, data) => {
  return prisma.creatorProfile.update({ where: { userId }, data });
};

const findById = (id) => {
  return prisma.creatorProfile.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true } } },
  });
};

module.exports = { findByUserId, create, update, findById };
