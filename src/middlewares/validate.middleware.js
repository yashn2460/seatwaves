const Joi = require("joi");
const { sendResponse } = require("../utils/responseHandler");

const validate = (schema) => (req, res, next) => {
  const validSchema = Joi.object(schema);
  const { value, error } = validSchema.validate(
    {
      body: req.body,
      query: req.query,
      params: req.params,
    },
    { abortEarly: false, stripUnknown: true }
  );

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return sendResponse(res, 400, errorMessage);
  }

  // Instead of assigning to req, we'll pass the validated data through res.locals
  res.locals.validatedData = value;
  return next();
};

module.exports = validate; 