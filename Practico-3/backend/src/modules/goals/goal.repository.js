const prisma = require("../../config/database");

const create = (data) => {
  return prisma.goal.create({ data });
};

const findByCreatorId = (creatorId) => {
  return prisma.goal.findMany({
    where: { creatorId },
    orderBy: { createdAt: "desc" },
  });
};

const findById = (id) => {
  return prisma.goal.findUnique({ where: { id } });
};

const deleteById = (id) => {
  return prisma.goal.delete({ where: { id } });
};

module.exports = { create, findByCreatorId, findById, deleteById };
