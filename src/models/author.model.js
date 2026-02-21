const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

authorSchema.index({ name: 1 });

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
