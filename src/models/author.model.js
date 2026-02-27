const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

authorSchema.plugin(toJSON);
authorSchema.plugin(paginate);

authorSchema.index({ name: 1 });

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
