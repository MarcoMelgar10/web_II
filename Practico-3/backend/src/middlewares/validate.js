const { error } = require("../utils/response");

const validate = (schema) => {
  return (req, res, next) => {
    const { error: validationError } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (validationError) {
      const messages = validationError.details.map((d) => d.message);
      return error(res, "Validation failed", 400, messages);
    }

    next();
  };
};

module.exports = validate;
