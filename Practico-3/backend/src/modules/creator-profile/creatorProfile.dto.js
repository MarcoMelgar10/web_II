const Joi = require("joi");

const createProfileDto = Joi.object({
  displayName: Joi.string().min(2).max(80).required(),
  bio: Joi.string().max(500).optional().allow(""),
});

const updateProfileDto = Joi.object({
  displayName: Joi.string().min(2).max(80).optional(),
  bio: Joi.string().max(500).optional().allow(""),
});

module.exports = { createProfileDto, updateProfileDto };
