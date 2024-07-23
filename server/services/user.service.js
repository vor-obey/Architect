const db = require('../models/index');

const { User } = db;

class UserService {
  async me(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const userObject = user.get({ plain: true });
    delete userObject.password;

    return userObject;
  }
}

module.exports = new UserService();
