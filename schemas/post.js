const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(new Date().getTime() + 1000 * 60 * 60 * 9),
  },
  content: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Post", postSchema);
