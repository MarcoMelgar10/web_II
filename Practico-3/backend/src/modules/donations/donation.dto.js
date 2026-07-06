const Joi = require("joi");

const createDonationDto = Joi.object({
  creatorId: Joi.string().required(),
  flanes: Joi.number().integer().min(1).required(),
});

module.exports = { createDonationDto };
