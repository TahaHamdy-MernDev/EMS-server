const { employee } = require("../../middleware/authMiddleware");

const router = require("express").Router();
router.use(employee);
router.use("/attendance", require("./attendanceRoutes"));
module.exports = router;
