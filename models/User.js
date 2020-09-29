var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

// function handleErrors(err) {
//   console.log(err.message, err.code);

//   let error = {
//     email: "",
//     username: "",
//     password: "",
//   };

//   if (err.message.includes("user validation failed")) {
//     Object.values(err.errors).forEach(({ properties }) => {
//       error[properties.path] = properties.message;
//     });
//   }

//   return errors;
// }

var userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already exists"],
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already registered"],
    },
    password: {
      required: [true, "Please include a password"],
      type: String,
      minlength: [6, "Password must be at least 6 chars long"],
    },
    bio: String,
    image: String,
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = function (plainpwd) {
  return bcrypt.compareSync(plainpwd, this.password);
};

userSchema.methods.returnAsProfile = function (user) {
  let profile = {
    username: this.username,
    bio: this.bio,
    image: this.avatar,
  };
  if (!user) {
    profile.following = false;
  } else {
    profile.following = this.followers.includes(user.id) ? true : false;
  }
  return { profile };
};

userSchema.methods.returnAsUser = function (token) {
  return {
    user: {
      username: this.username,
      id: this.id,
      email: this.email,
      token: token,
    },
  };
};

module.exports = mongoose.model("User", userSchema);
