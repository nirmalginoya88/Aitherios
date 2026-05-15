const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const buildToken = (user) => jwt.sign(
  { id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

const safeUser = (user) => ({
  id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role
});

const register = async (userData) => {
  try {
    const { firstName, lastName, email, password } = userData;

    if (!firstName || !lastName || !email || !password) {
      throw new Error('All fields are required');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    const token = buildToken(user);

    return { user: safeUser(user), token };
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = buildToken(user);
    return { user: safeUser(user), token };
  } catch (error) {
    throw error;
  }
};

module.exports = { register, login };