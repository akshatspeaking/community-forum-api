var User = require("../models/User");
var jwt = require("jsonwebtoken");

module.exports = {
  optional: async (req, res, next) => {
    try {
      if (req.headers.authorization.length > 8) {
        var decoded = jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.secret
        );
        let user = await User.findById(decoded);
        if (user) {
          console.log("logged in - continuing");
          req.user = user;
          req.user.token = req.headers.authorization.split(" ")[1];
          return next();
        } else {
          console.log("NOT logged in - continuing");
          req.user = null;
          return next();
        }
      } else {
        console.log("NOT logged in - continuing");
        req.user = null;
        return next();
      }
    } catch (error) {
      next(error);
    }
  },
  required: async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        var decoded = jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.secret
        );
        console.log(decoded);
        let user = await User.findById(decoded);
        if (user) {
          console.log("logged in - continuing");

          req.user = user;
          req.user.token = req.headers.authorization.split(" ")[1];
          return next();
        } else {
          console.log("NOT logged in - not continuing");
          req.user = null;
          res.status(401).json({ error: "Not Authorized" });
        }
      } else {
        console.log("NOT logged in - not continuing");
        req.user = null;
        res.status(401).json({ error: "Not Authorized" });
      }
    } catch (error) {
      next(error);
    }
  },
};
