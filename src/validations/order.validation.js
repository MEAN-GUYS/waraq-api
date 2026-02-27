const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object().keys({
          book: Joi.string().custom(objectId).required(),
          quantity: Joi.number().integer().min(1).required(),
          price: Joi.number().min(0).required(),
        })
      )
      .min(1)
      .required(),
    total: Joi.number().min(0).required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('Processing', 'Shipped', 'Out for Delivery', 'Delivered'),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrderStatus = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('Processing', 'Shipped', 'Out for Delivery', 'Delivered').required(),
  }),
};

const reviewItem = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
    itemId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      rating: Joi.number().integer().min(1).max(5),
      review: Joi.string().trim(),
      liked: Joi.boolean().allow(null),
    })
    .min(1),
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus, reviewItem };
