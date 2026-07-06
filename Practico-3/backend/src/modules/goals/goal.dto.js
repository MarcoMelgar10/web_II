const Joi = require("joi");

const createGoalDto = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().min(2).max(500).required(),
});

module.exports = { createGoalDto };
