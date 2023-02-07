const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const AppError = require("./helpers/AppError");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/user.route");
app.use("/api/v1", userRoute);

//catching no existing route
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   success: false,
  //   errors: `Can't find this route: => (${req.originalUrl}) on this server.`,
  // });
  throw new AppError(
    `Can't find this route: => (${req.originalUrl}) on this server.`,
    404
  );
});

const CatchErrorMiddleware = require("./middlewares/Catch-Error-Middleware");
app.use(CatchErrorMiddleware);

module.exports = app;
