var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tagSchema = new Schema({
  title: String,
  color: String,
}, {timestamps: true})

module.exports = mongoose.model("tag", tagSchema);
