const Joi = require("joi");

const registerDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("CREATOR", "FOLLOWER").required(),
});

const loginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerDto, loginDto };
