const bcrypt = require("bcryptjs");
const authRepository = require("./auth.repository");
const { sign } = require("../../utils/jwt");

const register = async ({ email, password, role }) => {
  const existing = await authRepository.findByEmail(email);
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await authRepository.createUser({ email, password: hashedPassword, role });

  const token = sign({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = sign({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

module.exports = { register, login };
