const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500),
  }),
};

const getReviews = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createReview,
  getReviews,
  deleteReview,
};
