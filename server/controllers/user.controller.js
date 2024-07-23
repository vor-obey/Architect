const UserService = require('../services/user.service');

class UserController {
  async me(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserService.me(userId);

      res.status(200).json({ user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
