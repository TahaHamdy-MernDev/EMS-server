const jwt = require("jsonwebtoken");
const asyncHandler = require("../handlers/asyncHandler");
const { userServices } = require("../models/userModel");
const { UserRole } = require("../config/enums");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.unauthorized({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userServices.findOne({ _id: decoded.userId });
    if (!user) {
      return res.unauthorized({ message: "User no longer exists" });
    }
    if (user.banned) {
      return res.forbidden({ message: "Sorry you have been banned...!" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.unauthorized({ message: "Token is invalid or expired" });
    }

    return res.unauthorized({ message: "Token is invalid or expired" });
  }
});
const authorizeRoles = (allowedRoles) => (req, res, next) => {
  authenticate(req, res, () => {
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.forbidden({
        message: `User role '${req.user.role}' is not authorized to access this resource`,
      });
    }
  });
};
module.exports = {
  authenticate,
  employee: authorizeRoles([UserRole.EMPLOYEE]),
  admin: authorizeRoles([UserRole.ADMIN]),
  superAdmin: authorizeRoles([UserRole.SUPER_ADMIN]),
};
