const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

authorSchema.plugin(toJSON);
authorSchema.index({ name: 1 });

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
