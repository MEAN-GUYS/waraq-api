const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const { Book } = require('../models');

const createBook = async (bookBody) => {
  return Book.create(bookBody);
};

const queryBooks = async (filter, options) => {
  const mongooseFilter = {};

  if (filter.name) {
    mongooseFilter.name = { $regex: filter.name, $options: 'i' };
  }

  if (filter.minPrice !== undefined) {
    mongooseFilter.price = { ...mongooseFilter.price, $gte: filter.minPrice };
  }

  if (filter.maxPrice !== undefined) {
    mongooseFilter.price = { ...mongooseFilter.price, $lte: filter.maxPrice };
  }

  return Book.paginate(mongooseFilter, options);
};

const getBookById = async (id) => {
  return Book.findById(id);
};

const updateBookById = async (bookId, updateBody) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  Object.assign(book, updateBody);
  await book.save();
  return book;
};

const deleteBookById = async (bookId) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  await book.deleteOne();
  return book;
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
