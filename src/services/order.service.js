const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const { Order } = require('../models');

const createOrder = async (userId, orderBody) => {
  const trackingNumber = 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const order = await Order.create({
    user: userId,
    items: orderBody.items,
    total: orderBody.total,
    trackingNumber,
    estimatedDelivery,
  });

  return order;
};

const getOrdersByUser = async (userId, filter, options) => {
  const mongooseFilter = { user: userId, ...filter };
  return Order.paginate(mongooseFilter, { ...options, populate: 'items.book' });
};

const getOrderById = async (orderId) => {
  return Order.findById(orderId).populate('items.book');
};

const updateOrderStatus = async (orderId, status) => {
  const order = await getOrderById(orderId);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  order.status = status;
  await order.save();
  return order;
};

const reviewItem = async (orderId, itemId, reviewBody) => {
  const order = await getOrderById(orderId);
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  if (order.status !== 'Delivered') throw new ApiError(httpStatus.BAD_REQUEST, 'Can only review delivered orders');

  const item = order.items.id(itemId);
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in order');

  Object.assign(item, reviewBody);
  await order.save();
  return order;
};

module.exports = { createOrder, getOrdersByUser, getOrderById, updateOrderStatus, reviewItem };
