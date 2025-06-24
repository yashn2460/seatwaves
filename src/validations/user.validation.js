const Joi = require("joi");

const updateProfile = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    otp: Joi.string().required().length(6),
    newPassword: Joi.string().required().min(6),
  }),
};

module.exports = {
  updateProfile,
  forgotPassword,
  changePassword,
  resetPassword,
}; 