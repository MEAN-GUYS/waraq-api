const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const { Review, Book, Order } = require('../models');

const createReview = async (userId, bookId, reviewBody) => {
  const book = await Book.exists({ _id: bookId });
  if (!book) throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');

  const purchased = await Order.hasPurchased(userId, bookId);
  if (!purchased) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You have to purchase the book before leaving a review');
  }

  try {
    return await Review.create({ user: userId, book: bookId, ...reviewBody });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.CONFLICT, 'You have already reviewed this book');
    } else {
      throw error;
    }
  }
};

const queryReviews = async (filter, options) => {
  return Review.paginate(filter, { ...options, populate: 'user' });
};

const deleteReview = async (reviewId, user) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }

  const isAdmin = user.role === 'admin';
  const isOwner = review.user.toString() === user.id;

  if (!isAdmin && !isOwner) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this review');
  }

  await review.deleteOne();

  return review;
};

module.exports = {
  createReview,
  queryReviews,
  deleteReview,
};
