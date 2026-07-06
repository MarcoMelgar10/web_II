const prisma = require("../../config/database");

const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const createUser = (data) => {
  return prisma.user.create({ data });
};

module.exports = { findByEmail, createUser };
