const router = require("express").Router();

router.use("/attendance", require("./attendanceRoutes"));
module.exports = router;
