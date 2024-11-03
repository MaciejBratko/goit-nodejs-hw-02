// schemas/contact.js
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least {#limit} characters long",
    "string.max": "Name cannot be longer than {#limit} characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .required()
    .messages({
      "string.base": "Phone must be a string",
      "string.empty": "Phone is required",
      "string.pattern.base":
        "Phone must be between 10-12 digits and may start with +",
      "any.required": "Phone is required",
    }),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least {#limit} characters long",
    "string.max": "Name cannot be longer than {#limit} characters",
  }),

  email: Joi.string().email().messages({
    "string.base": "Email must be a string",
    "string.email": "Please provide a valid email address",
  }),

  phone: Joi.string()
    .pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .messages({
      "string.base": "Phone must be a string",
      "string.pattern.base":
        "Phone must be between 10-14 digits and may start with +",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = {
  contactSchema,
  updateContactSchema,
};
