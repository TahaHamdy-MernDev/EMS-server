const asyncHandler = require("../handlers/asyncHandler");
const { saveRefreshToken } = require("../utils/refreshToken");
const refreshTokenService = require("../utils/dbServices")(
  require("../models/refreshTokensModel")
);
const userService = require("../utils/dbServices")(
  require("../models/userModel")
);
exports.register = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const userData = { ...req.body };
  const existingUser = await userService.findOne({ phone });
  if (existingUser) {
    return res.badRequest({
      message: "this phone number already exist...",
    });
  }
  await userService.create(userData);
  return res.success();
});
exports.login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await userService.findOne({ phone });

  if (!user) {
    return res.badRequest({ message: "Wrong phone number or password." });
  }
  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    return res.badRequest({ message: "Wrong phone number or password." });
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  await saveRefreshToken(user._id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.success({ data: { accessToken } });
});
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.unAuthorized({ message: "No refresh token provided" });
  }
  const storedToken = await refreshTokenService.findOne({
    token: refreshToken,
  });
  if (!storedToken) {
    return res.forbidden({
      message: "The refresh token is invalid or expired. Please log in again.",
    });
  }
  if (storedToken.expires < new Date()) {
    await refreshTokenService.deleteOne({ token: refreshToken });
    return res.forbidden({
      message: "The refresh token is invalid or expired. Please log in again.",
    });
  }
  const user = await userService.findOne({ _id: storedToken.userId });
  if (!user) {
    return res.forbidden({
      message: "The refresh token is invalid or expired. Please log in again.",
    });
  }
  const accessToken = await user.generateAccessToken();
  const newRefreshToken = await user.generateRefreshToken();

  await saveRefreshToken(user._id, newRefreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.success({ data: accessToken });
});
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  await refreshTokenService.deleteOne({ token: refreshToken });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.success();
});
