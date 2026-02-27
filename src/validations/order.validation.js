const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { SHIPPING_STATUSES, PAYMENT_STATUSES } = require('../models/order.model');

const addressSchema = Joi.object().keys({
  street: Joi.string().required().min(3).max(200),
  city: Joi.string().required().min(2).max(100),
  country: Joi.string().required().min(2).max(100),
});

const createOrder = {
  body: Joi.object().keys({
    address: addressSchema.required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    shippingStatus: Joi.string().valid(...SHIPPING_STATUSES),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

const updateOrderStatus = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      shippingStatus: Joi.string().valid(...SHIPPING_STATUSES),
      paymentStatus: Joi.string().valid(...PAYMENT_STATUSES),
    })
    .min(1),
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
