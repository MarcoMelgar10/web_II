const authService = require("./auth.service");
const { success, created } = require("../../utils/response");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return created(res, result, "User registered successfully");
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  return success(res, null, "Logged out successfully");
};

module.exports = { register, login, logout };
