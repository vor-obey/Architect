const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const {
  validateRegistration,
  validateLogin,
  validateRefreshToken,
} = require('../middlewares/authValidation.middleware');

router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/refresh', validateRefreshToken, AuthController.refreshToken);

module.exports = router;
