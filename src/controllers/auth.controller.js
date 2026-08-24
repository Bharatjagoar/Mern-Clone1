const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body);
  res.status(200).json(result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body);
  res.status(204).send();
});

const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll({ userId: req.auth.userId });
  res.status(204).send();
});

module.exports = { register, login, refresh, logout, logoutAll };
