const RefreshTokenModel = require("../models/refreshTokensModel");
const RefreshTokenService = require("./dbServices")(RefreshTokenModel);

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
module.exports = { saveRefreshToken };
