var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var answerSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      required: [true, "QuestionId must be valid"],
      ref: "Question",
    },
    body: String,
    author: {
      type: Schema.Types.ObjectId,
      required: [true, "Every answer must have an author"],
      ref: "User",
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

answerSchema.methods.returnSingleAnswer = function (user) {
  return {
    answer: {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      body: this.body,
      author: {
        username: this.author.username,
        bio: this.author.bio,
        image: this.author.image,
        following: !user
          ? false
          : this.author.followers.includes(user.id)
          ? true
          : false,
      },
    },
  };
};

module.exports = mongoose.model("answer", answerSchema);

// export default mongoose.model("answer", answerSchema)
