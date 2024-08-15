const RefreshTokenModel = require("../models/refreshTokensModel");
const RefreshTokenService = require("./dbServices")(RefreshTokenModel);
const jwt = require("jsonwebtoken");
async function saveRefreshToken(userId, token) {
  const existingUserToken = await RefreshTokenService.findMany({ userId });
  if (existingUserToken) {
    await RefreshTokenService.deleteMany({ userId });
  }
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await RefreshTokenService.create({
    token,
    userId,
    expires,
  });
}
async function generateAccessToken(user) {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
  return accessToken;
}

async function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
}

module.exports = {
  saveRefreshToken,
  generateAccessToken,
  generateRefreshToken,
};
