const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

reviewSchema.index({ user: 1, book: 1 }, { unique: true });
reviewSchema.index({ book: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
