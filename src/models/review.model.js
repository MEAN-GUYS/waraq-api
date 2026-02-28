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

reviewSchema.statics.updateRatingStats = async function (bookId) {
  const Book = require('./book.model');
  const [stats] = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats ? parseFloat(stats.averageRating.toFixed(1)) : 0;
  const reviewCount = stats ? stats.reviewCount : 0;

  await Book.findByIdAndUpdate(bookId, { averageRating, reviewCount });
};

reviewSchema.post('save', async function () {
  await this.constructor.updateRatingStats(this.book);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.updateRatingStats(this.book);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
