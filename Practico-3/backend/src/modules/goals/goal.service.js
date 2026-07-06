const goalRepository = require("./goal.repository");

const createGoal = (creatorId, data) => {
  return goalRepository.create({ creatorId, ...data });
};

const getGoalsByCreator = (creatorId) => {
  return goalRepository.findByCreatorId(creatorId);
};

const deleteGoal = async (id, creatorId) => {
  const goal = await goalRepository.findById(id);
  if (!goal) {
    const err = new Error("Goal not found");
    err.statusCode = 404;
    throw err;
  }
  if (goal.creatorId !== creatorId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  return goalRepository.deleteById(id);
};

module.exports = { createGoal, getGoalsByCreator, deleteGoal };
