var mongoose = require("mongoose");
var slugify = require("slugify");
var Schema = mongoose.Schema;

var questionSchema = new Schema(
  {
    slug: {
      type: String,
      unique: [true, "Slug must be unique for each question"],
    },
    title: String,
    description: String,
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    author: {
      type: Schema.Types.ObjectId,
      required: [true, "question needs author"],
      ref: "User",
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

questionSchema.methods.returnSingleQuestion = function (user) {
  return {
    question: {
      slug: this.slug,
      id: this.id,
      title: this.title,
      description: this.description,
      tagList: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      answers: this.answers,
      following: !user
        ? false
        : this.followers.includes(user.id)
        ? true
        : false,
      // favoritesCount: this.favorited.length,
      author: this.author,
    },
  };
};

questionSchema.pre("save", function (next) {
  this.slug = slugify(this.title.toLowerCase());
  next();
});

module.exports = mongoose.model("Question", questionSchema);
