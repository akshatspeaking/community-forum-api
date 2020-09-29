var Question = require("../models/Question");
var Answer = require("../models/Answer");

module.exports = {
  createAnswer: async (req, res, next) => {
    try {
      let art = await Question.findOne({ slug: req.params.slug });
      req.body.answer.question = art.id;
      req.body.answer.author = req.user.id;
      let answer = await Answer.create(req.body.answer);
      await Question.findOneAndUpdate(
        { slug: req.params.slug },
        { $push: { answers: answer.id } },
        { new: true }
      );
      answer = answer.returnSingleAnswer(req.user);
      res.json(answer);
    } catch (error) {
      next(error);
    }
  },
  deleteAnswer: async (req, res, next) => {
    try {
      let toEdit = await Answer.findById(req.params.answerid);
      if (toEdit.author == req.user.id) {
        let answer = await Answer.findByIdAndDelete(req.params.answerId);
        let art = await Question.findByIdAndUpdate(
          { answers: { $in: answer.id } },
          { answers: { $pull: answer.id } }
        );
        console.log(art.answers);
        return res.send("Answer Deleted");
      } else {
        return res
          .status(403)
          .json({ error: "You are not the author of this answer" });
      }
    } catch (error) {
      next(error);
    }
  },
  readAllAnswers: async (req, res, next) => {
    try {
      let question = await Question.findOne({ slug: req.params.slug });
      let answersPopulated = await Answer.find({
        question: question.id,
      }).populate("author");
      let answersToReturn = [];
      answersPopulated.forEach((answer) => {
        answersToReturn.push(answer.returnSingleAnswer(req.user).answer);
      });
      res.json({
        answers: answersToReturn,
        answersCount: answersToReturn.length,
      });
    } catch (error) {
      next(error);
    }
  },
  addUpvote: async (req, res, next) => {
    try {
      const answer = await Answer.findOneAndUpdate(
        req.params.id,
        {
          $push: { upvotes: req.user.id },
        },
        { new: true }
      );
      console.log(answer);
      res.status(200).json({ success: true, message: "upvoted" });
    } catch (error) {
      next(error);
    }
  },
  removeUpvote: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
};
