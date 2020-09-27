var express = require("express");
var router = express.Router();
var userController = require("../../controllers/userController");
var jwtAuth = require("../../middleware/jwt-auth");

// View Other Profile
router.get("/:username", jwtAuth.optional, userController.viewOtherProfile);

// Follow User
router.post("/:username/follow", jwtAuth.required, userController.followUser);

// Unfollow user
router.delete(
  "/:username/follow",
  jwtAuth.required,
  userController.unfollowUser
);

module.exports = router;
