const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const responseHandler = require("node-response-handler");
app.use(responseHandler);
app.use(morgan("dev"));
app.use(
  cors({
    origin: [process.env.CLIENT_URI, "http://192.168.1.2:3000"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/employee-management-system/v1", require("../routes"));
app.use("*", (req, res) => {
  console.log(req);
  return res.recordNotFound({
    message: `Cant't find route method:${req.method} url:${req.originalUrl}`,
  });
});
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.forbidden({ message: "Invalid CSRF token" });
  }
  console.log(err);
  return res.internalServerError({ message: err.message, stack: err.stack });
});
module.exports = app;
