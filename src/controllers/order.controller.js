const { status: httpStatus } = require('http-status');
const pick = require('../utils/pick');
const { orderService } = require('../services');

const createOrder = async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body.items, req.body.address);
  res.status(httpStatus.CREATED).send(order);
};

const getOrders = async (req, res) => {
  const filter = { ...pick(req.query, ['shippingStatus']), ...req.additionalFilters };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await orderService.queryOrders(filter, options);

  res.send(result);
};

const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.orderId, req.body);
  res.send(order);
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
