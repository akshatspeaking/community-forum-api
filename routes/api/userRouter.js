var express = require("express");
var router = express.Router();
var User = require("../../models/User");
var userController = require("../../controllers/userController");
var jwtAuth = require("../../middleware/jwt-auth");
const passport = require("passport");

/* View my profile */
router.get("/", jwtAuth.required, userController.viewMyProfile);

// Update my profile
router.put("/", jwtAuth.required, userController.updateProfile);

// Register user
router.post("/", userController.registerUser);

// Login user
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userController.loginUser
);

module.exports = router;
