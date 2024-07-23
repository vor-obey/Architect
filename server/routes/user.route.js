const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.get('/me', AuthMiddleware, UserController.me);

module.exports = router;
