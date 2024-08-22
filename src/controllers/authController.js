const asyncHandler = require("../handlers/asyncHandler");
const { userServices } = require("../models/userModel");
const {
  saveRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");
const refreshTokenService = require("../utils/dbServices")(
  require("../models/refreshTokensModel")
);
const bcrypt = require("bcrypt");
exports.register = asyncHandler(async (req, res) => {
  const userData = { ...req.body };
  const existingUser = await userServices.findOne({
    $or: [{ phone: req.body.phone }, { email: req.body.email }],
  });

  if (existingUser) {
    return res.conflict({
      message:
        existingUser.phone === req.body.phone
          ? "Phone number already in use"
          : "Email address already in use",
    });
  }
  await userServices.create(userData);
  return res.success();
});
exports.login = asyncHandler(async (req, res) => {
  const { phone, password, deviceToken } = req.body;
  console.log(req.body);
  const user = await userServices.findOne({ phone });

  if (!user) {
    return res.badRequest({ message: "Wrong phone number or password." });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.badRequest({ message: "Wrong phone number or password." });
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  await saveRefreshToken(user._id, refreshToken);

  if (deviceToken) {
    const tokenExists = user.deviceTokens?.includes(deviceToken);
    if (!tokenExists) {
      const updatedUser = await userServices.updateOne(
        { _id: user._id },
        { $push: { deviceTokens: deviceToken } }
      );
      if (!updatedUser) {
        return res.recordNotFound({ message: "User not found..." });
      }
    }
  }
  return res.success({ data: { refreshToken, accessToken, role: user.role } });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.unauthorized({ message: "No refresh token provided" });
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
  const user = await userServices.findOne({ _id: storedToken.userId });
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
