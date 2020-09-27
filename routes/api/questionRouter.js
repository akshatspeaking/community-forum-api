var express = require("express");
var router = express.Router();
var questionController = require("../../controllers/questionController");
var answerController = require("../../controllers/answerController");
var jwtAuth = require("../../middleware/jwt-auth");
var Question = require("../../models/Question");
var User = require("../../models/User");
/*
   FEED
*/

// Global feed

router.get("/test", (req, res) => {
  res.json({"Success": 123})
})


router.get("/", jwtAuth.optional, async (req, res, next) => {
  try {
    let limit = Number(req.query.limit) || 20;
    let offset = Number(req.query.offset) || 0;

    let queries = ["author", "tag", "favorited"];
    let opts = {};
    console.log(req.query);
    queries.forEach(async (q) => {
      if (req.query[q]) {
        if (q == "tag") {
          opts.tags = req.query[q];
        } else if (q == "favorited") {
          let u = await User.findOne({ username: req.query.favorited });
          let id = u.id;
          opts.favorited = id;
        } else if (q == "author") {
          opts.author = req.query[q];
        }
      }
    });
    console.log(opts);
    let questions = await Question.find(opts)
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit)
      .populate("author");
    var toReturn = [];
    console.log(questions);

    questions.forEach((question) => {
      toReturn.push(question.returnSingleQuestion(req.user).question);
    });
    res.json({
      questions: toReturn,
      questionsCount: toReturn.length,
    });
  } catch (error) {
    next(error);
  }
});

// Following Feed
router.get("/feed", jwtAuth.required, async (req, res, next) => {
  try {
    let limit = Number(req.query.limit) || 20;
    let offset = Number(req.query.offset) || 0;

    let questions = await Question.find({
      author: { $in: req.user.following },
    })
      .populate("author")
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit);

    let toReturn = [];

    questions.forEach((question) => {
      toReturn.push(question.returnSingleQuestion(req.user).question);
    });

    res.json({
      questions: toReturn,
      questionsCount: toReturn.length,
    });
  } catch (error) {
    next(error);
  }
});

/*
   QUESTIONS
*/

// Create new question
router.post("/", jwtAuth.required, questionController.createQuestion);

// Update question
router.put("/:slug", jwtAuth.required, questionController.updateQuestion);

// Delete question
router.delete("/:slug", jwtAuth.required, questionController.deleteQuestion);

// Read question
router.get("/:slug", jwtAuth.optional, questionController.readQuestion);

// Favorite question
router.post(
  "/:slug/favorite",
  jwtAuth.required,
  questionController.favoriteQuestion
);

// Unfoavorite question
router.delete(
  "/:slug/favorite",
  jwtAuth.required,
  questionController.unfavoriteQuestion
);

/*
   ANSWERS
*/

// Add answer
router.post("/:slug/answers", jwtAuth.required, answerController.createAnswer);

// Delete answer
router.delete(
  "/:slug/answers/:answerid",
  jwtAuth.required,
  answerController.deleteAnswer
);

// Read all answers
router.get("/:slug/answers", answerController.readAllAnswers);

module.exports = router;
