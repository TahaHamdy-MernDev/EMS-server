const { validateRequest } = require("../utils/validateRequest");
const { registerSchema, loginSchema } = require("../utils/validation/auth");
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh-token", refreshToken);
// router.post("/save-token", authenticate, saveDeviceToken);
router.post("/logout", logout);

module.exports = router;
