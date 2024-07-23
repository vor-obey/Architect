const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const { USER_NOT_FOUND, INVALID_PASSWORD, REFRESH_NOT_FOUND, INVALID_REFRESH } = require("../constants/errors");

require('dotenv').config();

const { User, RefreshToken } = db;

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

class AuthService {
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
  }

  async generateRefreshToken(userId) {
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    const oldToken = await RefreshToken.findOne({ where: { userId } });

    oldToken
      ? await RefreshToken.update({ token: refreshToken }, { where: { userId } })
      : await RefreshToken.create({ userId, token: refreshToken });

    return refreshToken;
  }

  async register({ firstName, lastName, email, password, position }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      position,
    });

    const userObject = user.get({ plain: true });
    delete userObject.password;

    return userObject;
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(USER_NOT_FOUND);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error(INVALID_PASSWORD);

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken) {
    try {
      // Verify the old refresh token
      const decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);
      // Check if the token exists in the database
      const existingToken = await RefreshToken.findOne({ where: { token: oldRefreshToken } });

      if (!existingToken) {
        throw new Error(REFRESH_NOT_FOUND);
      }

      // Generate new tokens
      const accessToken = this.generateAccessToken(decoded.id);
      const refreshToken = await this.generateRefreshToken(decoded.id);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(INVALID_REFRESH);
    }
  }
}

module.exports = new AuthService();
