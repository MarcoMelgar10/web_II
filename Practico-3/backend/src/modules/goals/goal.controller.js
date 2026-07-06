const goalService = require("./goal.service");
const { success, created } = require("../../utils/response");

const create = async (req, res, next) => {
  try {
    const goal = await goalService.createGoal(req.user.id, req.body);
    return created(res, goal, "Goal created");
  } catch (err) {
    next(err);
  }
};

const getByCreator = async (req, res, next) => {
  try {
    const goals = await goalService.getGoalsByCreator(req.params.creatorId);
    return success(res, goals);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await goalService.deleteGoal(req.params.id, req.user.id);
    return success(res, null, "Goal deleted");
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getByCreator, remove };
