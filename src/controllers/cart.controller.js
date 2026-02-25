const { status: httpStatus } = require('http-status');
const { cartService } = require('../services');

const getCart = async (req, res) => {
  const cart = await cartService.getCartByUser(req.user.id);
  res.status(httpStatus.OK).send(cart);
};

const addItem = async (req, res) => {
  const { bookId, quantity } = req.body;
  const cart = await cartService.addItem(req.user.id, bookId, quantity);
  res.status(httpStatus.OK).send(cart);
};

const updateItem = async (req, res) => {
  const cart = await cartService.updateItem(req.user.id, req.params.bookId, req.body.quantity);
  res.status(httpStatus.OK).send(cart);
};

const removeItem = async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.bookId);
  res.status(httpStatus.OK).send(cart);
};

const clearCart = async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  res.status(httpStatus.OK).send(cart);
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
