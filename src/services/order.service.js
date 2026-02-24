const mongoose = require('mongoose');
const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const { Order, Book } = require('../models');
const { VALID_SHIPPING_TRANSITIONS } = require('../models/order.model');

const createOrder = async (userId, cartItems, address) => {
  return mongoose.connection.transaction(async () => {
    const requestedBookIds = cartItems.map((item) => item.book);
    const books = await Book.find({ _id: { $in: requestedBookIds } });

    const fetchedBooksMap = new Map(books.map((book) => [book.id, book]));

    const stockUpdates = [];
    const orderItems = [];
    let totalPrice = 0;

    for (const cartItem of cartItems) {
      const { book: requestedBookId, quantity: requestedQuantity } = cartItem;

      const book = fetchedBooksMap.get(requestedBookId);

      if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, `Book with id ${requestedBookId} not found`);
      }

      if (book.stock < requestedQuantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient stock for "${book.name}".`);
      }

      stockUpdates.push({
        updateOne: {
          filter: { _id: requestedBookId },
          update: { $inc: { stock: -requestedQuantity } },
        },
      });
      orderItems.push({
        book: book.id,
        name: book.name,
        cover: book.cover,
        price: book.price,
        quantity: requestedQuantity,
      });

      totalPrice += book.price * requestedQuantity;
    }

    await Book.bulkWrite(stockUpdates);

    return Order.create({ user: userId, items: orderItems, address, totalPrice });
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

  if (shippingStatus) {
    const allowed = VALID_SHIPPING_TRANSITIONS[order.shippingStatus];

    if (!allowed.includes(shippingStatus)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot transition from "${order.shippingStatus}" to "${shippingStatus}"`
      );
    }

    order.shippingStatus = shippingStatus;
  }

  if (paymentStatus) {
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
