const { Review } = require('../models');

const createReview = async (userId, body) => {
  const existing = await Review.findOne({ user: userId, book: body.bookId });
  if (existing) {
    Object.assign(existing, {
      rating: body.rating,
      review: body.review,
      liked: body.liked,
    });
    await existing.save();
    return existing;
  }

  return Review.create({
    user: userId,
    book: body.bookId,
    rating: body.rating,
    review: body.review,
    liked: body.liked,
  });
};

const getBookReviews = async (bookId) => {
  return Review.find({ book: bookId }).populate('user', 'name').sort({ createdAt: -1 });
};

module.exports = { createReview, getBookReviews };
