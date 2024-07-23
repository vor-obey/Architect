const { body } = require('express-validator');
const { nextFunction } = require('../utils/helpers');
const {
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  INVALID_EMAIL,
  INVALID_PASSWORD_LENGTH,
  PASSWORD_REQUIRED,
  REFRESH_REQUIRED,
} = require('../constants/errors');

const validateRegistration = [
  body('firstName').notEmpty().withMessage(FIRST_NAME_REQUIRED),
  body('lastName').notEmpty().withMessage(LAST_NAME_REQUIRED),
  body('email').isEmail().withMessage(INVALID_EMAIL),
  body('password').isLength({ min: 8 }).withMessage(INVALID_PASSWORD_LENGTH),
  nextFunction,
];

const validateLogin = [
  body('email').isEmail().withMessage(INVALID_EMAIL),
  body('password').notEmpty().withMessage(PASSWORD_REQUIRED),
  nextFunction,
];

const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage(REFRESH_REQUIRED),
  nextFunction,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateRefreshToken,
};
