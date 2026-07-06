const Joi = require("joi");

const createCommentDto = Joi.object({
  postId: Joi.string().required(),
  text: Joi.string().min(1).max(500).required(),
});

module.exports = { createCommentDto };
