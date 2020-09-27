var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongoose = require("./config/mongoose");

var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api/apiRouter");
const passport = require("passport");

require("dotenv").config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.name == "MongoError") {
    console.log(err);

    if (err.code == 11000) {
      return res.status(422).send({ error: "duplicate key" });
    }
  }
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
