const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");
var jwt = require("jsonwebtoken");

module.exports = {
  updateProfile: async (req, res) => {
    try {
      console.log(req.user, "logged in user");
      let user = await User.findByIdAndUpdate(req.user.id, req.body.user, {
        new: true,
      });
      user.token = req.user.token;
      req.user = user;
      res.json(req.user.returnAsUser(req.user.token));
    } catch (error) {
      next(error);
    }
  },
  viewMyProfile: (req, res) => {
    res.json(req.user.returnAsUser(req.user.token));
  },
  viewOtherProfile: async (req, res) => {
    try {
      let user = await User.findOne({ username: req.params.username });
      res.json(user.returnAsProfile(req.user));
    } catch (error) {
      next(error);
    }
  },
  followUser: async (req, res) => {
    try {
      let check = await User.findById(req.params.id);
      if (check.followers.includes(req.user.id)) {
        return res
          .status(422)
          .json({ error: "You are already following this user" });
      }

      let user = await User.findOneAndUpdate(
        { username: req.params.username },
        { $push: { followers: req.user.id } },
        { new: true }
      );
      let currUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: { following: user.id },
        },
        { new: true }
      );
      currUser.token = req.user.token;
      req.user = currUser;
      console.log("following", req.user, user);
      res.json(user.returnAsProfile(req.user));
    } catch (error) {
      next(error);
    }
  },
  unfollowUser: async (req, res) => {
    try {
      let check = await User.findById(req.params.id);
      if (!check.followers.includes(req.user.id)) {
        return res
          .status(422)
          .json({ error: "You are already not following this user" });
      }

      let user = await User.findOneAndUpdate(
        { username: req.params.username },
        { $pull: { followers: req.user.id } },
        { new: true }
      );
      let currUser = User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { following: user.id },
        },
        { new: true }
      );
      currUser.token = req.user.token;
      req.user = currUser;
      res.json(user.returnAsProfile(req.user));
    } catch (error) {
      next(error);
    }
  },
  registerUser: async (req, res, next) => {
    try {
      console.log("registering ");
      let user = await User.create({
        email: req.body.user.email,
        username: req.body.user.username,
        password: req.body.user.password,
      });
      let token = jwt.sign(user.id, process.env.secret);
      let userJson = user.returnAsUser(token);
      res.json(userJson);
    } catch (error) {
      next(error);
    }
  },
  loginUser: (req, res) => {
    let token = jwt.sign(req.user.id, process.env.secret);
    let userJson = req.user.returnAsUser(token);
    res.json(userJson);
  },
  verifyUser: (req, res) => {
    if (req.user) {
      res.json(req.user.returnAsUser(req.user.token));
    } else {
      res.json({});
    }
  },
};
