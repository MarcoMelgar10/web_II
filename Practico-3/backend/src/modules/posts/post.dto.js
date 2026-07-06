const Joi = require("joi");

const createPostDto = Joi.object({
  text: Joi.string().min(1).max(2000).required(),
});

module.exports = { createPostDto };
