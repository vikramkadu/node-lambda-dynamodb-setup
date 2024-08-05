const Joi = require('joi');

const userSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const validateUser = (data) => {
  return userSchema.validate(data);
};

module.exports = { validateUser };
