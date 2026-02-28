const { status: httpStatus } = require('http-status');
const pick = require('../utils/pick');
const { reviewService } = require('../services');

const createReview = async (req, res) => {
  const { bookId, ...reviewBody } = req.body;
  const review = await reviewService.createReview(req.user.id, bookId, reviewBody);
  res.status(httpStatus.CREATED).send(review);
};

const getReviews = async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = pick(req.query, ['book']);
  const result = await reviewService.queryReviews(filter, options);
  res.status(httpStatus.OK).send(result);
};

const deleteReview = async (req, res) => {
  await reviewService.deleteReview(req.params.reviewId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  createReview,
  getReviews,
  deleteReview,
};
