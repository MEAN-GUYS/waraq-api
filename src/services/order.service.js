const mongoose = require('mongoose');
const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const { Order, Book } = require('../models');
const cartService = require('./cart.service');
const { VALID_SHIPPING_TRANSITIONS } = require('../models/order.model');

const createOrder = async (userId, address, paymentMethod) => {
  return mongoose.connection.transaction(async () => {
    const cart = await cartService.getCartByUser(userId);
    if (cart.items.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
    }

    const stockUpdates = [];
    const orderItems = [];
    let totalPrice = 0;

    for (const cartItem of cart.items) {
      const { book, quantity } = cartItem;

      if (!book) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'A book in your cart is no longer available');
      }

      if (book.stock < quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient stock for "${book.name}".`);
      }

      stockUpdates.push({
        updateOne: {
          filter: { _id: book.id },
          update: { $inc: { stock: -quantity } },
        },
      });

      orderItems.push({
        book: book.id,
        name: book.name,
        cover: book.cover,
        price: book.price,
        quantity,
      });

      totalPrice += book.price * quantity;
    }

    await Book.bulkWrite(stockUpdates);

    const order = await Order.create({ user: userId, items: orderItems, address, totalPrice, paymentMethod });

    cart.items = [];
    await cart.save();

    return order;
  });
};

const queryOrders = async (filter, options) => {
  return Order.paginate(filter, options);
};

const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const { shippingStatus, paymentStatus } = newStatus;

  if (shippingStatus && shippingStatus !== order.shippingStatus) {
    const allowed = VALID_SHIPPING_TRANSITIONS[order.shippingStatus];

    if (!allowed.includes(shippingStatus)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot transition from "${order.shippingStatus}" to "${shippingStatus}"`
      );
    }

    order.shippingStatus = shippingStatus;
  }

  if (paymentStatus && paymentStatus !== order.paymentStatus) {
    if (order.paymentStatus === 'success') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment status cannot be changed after success');
    }

    order.paymentStatus = paymentStatus;
  }

  await order.save();

  return order;
};

module.exports = {
  createOrder,
  queryOrders,
  updateOrderStatus,
};
