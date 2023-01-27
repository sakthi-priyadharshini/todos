const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  signupSchema,
};
