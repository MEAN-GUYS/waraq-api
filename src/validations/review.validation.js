const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    review: Joi.string().allow('').max(500),
    liked: Joi.boolean().allow(null),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    book: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createReview,
  getReviews,
  deleteReview,
};
