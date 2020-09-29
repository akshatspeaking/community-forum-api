var Question = require("../models/Question");
var User = require("../models/User");

module.exports = {
  createQuestion: async (req, res, next) => {
    try {
      req.body.question.author = req.user.id;
      let question = await (
        await Question.create(req.body.question)
      ).execPopulate("author");
      let user = await User.findByIdAndUpdate(req.user.id, {
        $push: { questions: question.id },
      });
      res.json(question.returnSingleQuestion(req.user));
    } catch (error) {
      next(error);
    }
  },
  updateQuestion: async (req, res, next) => {
    try {
      let toEdit = await Question.findOne({ slug: req.params.slug });
      if (toEdit.author == req.user.id) {
        let question = await (
          await Question.findOneAndUpdate(
            { slug: req.params.slug },
            req.body.question,
            { new: true }
          )
        ).execPopulate("author");
        res.json(question.returnSingleQuestion(req.user));
      } else {
        res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteQuestion: async (req, res, next) => {
    try {
      let toEdit = await Question.findOne({ slug: req.params.slug });
      if (toEdit.author == req.user.id) {
        let question = await (
          await Question.findOneAndDelete({ slug: req.params.slug })
        ).execPopulate("author");
        User.findByIdAndUpdate();
        res.send("Question Deleted");
      } else {
        res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }
    } catch (error) {
      next(error);
    }
  },
  readQuestion: async (req, res) => {
    try {
      let question = await (
        await Question.findOne({ slug: req.params.slug })
      ).execPopulate("answers");
      // console.log(question, question.returnSingleQuestion(req.user));
      const jsonQuestion = question.returnSingleQuestion(req.user);
      jsonQuestion.answers = question.answers;
      res.json(jsonQuestion);
    } catch (error) {
      next(error);
    }
  },
  favoriteQuestion: async (req, res) => {
    try {
      let check = await Question.findOne({ slug: req.params.slug });
      if (check.favorited.includes(req.user.id)) {
        return res
          .status(422)
          .json({ error: "You have already favorited this question" });
      }

      let question = await Question.findOneAndUpdate(
        { slug: req.params.slug },
        { $push: { favorited: req.user.id } },
        { new: true }
      );
      let currUser = User.findByIdAndUpdate(
        req.user.id,
        {
          $push: { favorites: question.id },
        },
        { new: true }
      );
      currUser.token = req.user.token;
      req.user = currUser;
      let questionToReturn = await (
        await Question.findById(question.id)
      ).execPopulate("author");
      res.json(questionToReturn.returnSingleQuestion(req.user));
    } catch (error) {
      next(error);
    }
  },

  unfavoriteQuestion: async (req, res) => {
    try {
      let check = await Question.findOne({ slug: req.params.slug });
      if (!check.favorited.includes(req.user.id)) {
        return res
          .status(422)
          .json({ error: "You have already unfavorited this question" });
      }

      let question = await Question.findOneAndUpdate(
        { slug: req.params.slug },
        { $pull: { favorited: req.user.id } },
        { new: true }
      );
      let currUser = User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { favorites: question.id },
        },
        { new: true }
      );
      currUser.token = req.user.token;
      req.user = currUser;
      let questionToReturn = await (
        await Question.findById(question.id)
      ).execPopulate("author");
      res.json(questionToReturn.returnSingleQuestion(req.user));
    } catch (error) {
      next(error);
    }
  },
};
