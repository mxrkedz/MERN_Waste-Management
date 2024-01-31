const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
