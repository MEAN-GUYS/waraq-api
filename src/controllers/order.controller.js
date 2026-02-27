const { status: httpStatus } = require('http-status');
const { orderService } = require('../services');
const pick = require('../utils/pick');

const createOrder = async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(order);
};

const getOrders = async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.getOrdersByUser(req.user.id, filter, options);
  res.send(result);
};

const getOrder = async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  res.send(order);
};

const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
  res.send(order);
};

const reviewItem = async (req, res) => {
  const order = await orderService.reviewItem(req.params.orderId, req.params.itemId, req.body);
  res.send(order);
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus, reviewItem };
