const AuthService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, position } = req.body;

      const user = await AuthService.register({ firstName, lastName, email, password, position });

      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await AuthService.login({ email, password });

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken: oldRefreshToken } = req.body;

      const { accessToken, refreshToken } = await AuthService.refreshToken(oldRefreshToken);

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
