const { status: httpStatus } = require('http-status');
const { reviewService } = require('../services');

const createReview = async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(review);
};

const getBookReviews = async (req, res) => {
  const reviews = await reviewService.getBookReviews(req.params.bookId);
  res.send(reviews);
};

module.exports = { createReview, getBookReviews };
