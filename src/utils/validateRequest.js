/**
 * Creates a middleware function for request validation.
 * @param {Object} schema - Joi schema for validation
 * @param {string} [source='body'] - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    };
    console.log(req[source]);
    const { error, value } = schema.validate(req[source], validationOptions);
    if (error) {
      const errors = error.details.map((err) => {
        return {
          message: err.message.replace(/['"]/g, ""),
        };
      });
      console.error("Validation error:", JSON.stringify(errors, null, 2));

      return res.validationError({ errors });
    }
    req[source] = value;
    next();
  };
};

module.exports = { validateRequest };
