const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name must be less than 30 characters long",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name must be less than 30 characters long",
    "any.required": "Last name is required",
  }),
  phone: Joi.string()
    .pattern(/^(010|011|012|015)\d{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Provide a valid phone number",
    }),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character",
    }),
});

const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^(010|011|012|015)\d{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Provide valid phone number",
    }),
  password: Joi.string().max(32).required(),
  deviceToken: Joi.string().allow(''),
});

module.exports = {
  registerSchema,
  loginSchema,
};
