const jwt = require("jsonwebtoken");
const asyncHandler = require("../handlers/asyncHandler");
const { userServices } = require("../models/userModel");
const { UserRole } = require("../config/enums");

exports.authenticate = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.unAuthorized({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userServices.findOne({ _id: decoded.id });
    if (!user) {
      return res.unAuthorized({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.unAuthorized({ message: "Token is invalid or expired" });
    }

    return res.unAuthorized({ message: "Token is invalid or expired" });
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
  isEmployee: authorizeRoles([UserRole.EMPLOYEE]),
  isAdmin: authorizeRoles([UserRole.ADMIN]),
  isSuperAdmin: authorizeRoles([UserRole.SUPER_ADMIN]),
};
