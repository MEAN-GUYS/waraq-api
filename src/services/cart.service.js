const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const { Cart, Book } = require('../models');

const getCartByUser = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.book');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const addItem = async (userId, bookId, quantity) => {
  const bookExists = await Book.exists({ _id: bookId });
  if (!bookExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  const cart = await getCartByUser(userId);
  const existingItem = cart.items.find((i) => i.book._id.toString() === bookId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ book: bookId, quantity });
  }

  await cart.save();

  return cart;
};

const updateItem = async (userId, bookId, quantity) => {
  const cart = await getCartByUser(userId);
  const item = cart.items.find((i) => i.book._id.toString() === bookId);

  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in cart');

  item.quantity = quantity;
  await cart.save();
  return cart;
};

const removeItem = async (userId, bookId) => {
  const cart = await getCartByUser(userId);
  cart.items = cart.items.filter((i) => i.book._id.toString() !== bookId);
  await cart.save();
  return cart;
};

const clearCart = async (userId) => {
  const cart = await getCartByUser(userId);
  cart.items = [];
  await cart.save();
  return cart;
};

module.exports = { getCartByUser, addItem, updateItem, removeItem, clearCart };
