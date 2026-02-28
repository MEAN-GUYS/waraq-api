const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    review: Joi.string().trim().allow(''),
    liked: Joi.boolean().allow(null),
  }),
};

const getBookReviews = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

module.exports = { createReview, getBookReviews };
