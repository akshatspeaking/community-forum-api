var express = require("express");
var router = express.Router();
var questionRouter = require("./questionRouter");
var userRouter = require("./userRouter");
var profileRouter = require("./profileRouter");
const Question = require("../../models/Question");

router.use("/users", userRouter);
router.use("/user", userRouter);
router.use("/profiles", profileRouter);
router.use("/questions", questionRouter);
// Get tags
router.get("/tags", async (req, res, next) => {
  let tagsToSend = await Article.distinct("tags");
  console.log(tagsToSend);

  res.send({
    tags: tagsToSend,
  });
});

module.exports = router;
