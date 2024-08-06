const router = require("express").Router();
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
router.use("/auth", require("./auth"));
router.use(csrfProtection);
router.get("/csrf-token", (req, res) => {
  res.success({ data: { csrfToken: req.csrfToken() } });
});
module.exports = router;
