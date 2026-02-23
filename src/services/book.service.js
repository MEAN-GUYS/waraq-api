const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const escapeRegex = require('../utils/escapeRegex');
const { Book } = require('../models');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const cloudinary = require('../config/cloudinary');

const createBook = async (bookBody, coverBuffer) => {
  const { secure_url, public_id } = await uploadToCloudinary(coverBuffer);
  return Book.create({ ...bookBody, cover: secure_url, coverId: public_id });
};

const queryBooks = async (filter, options) => {
  const mongooseFilter = {};

  if (filter.name) {
    mongooseFilter.name = { $regex: escapeRegex(filter.name), $options: 'i' };
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

const updateBookById = async (bookId, updateBody, coverBuffer) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  if (coverBuffer) {
    const { secure_url, public_id } = await uploadToCloudinary(coverBuffer);
    updateBody.cover = secure_url;
    updateBody.coverId = public_id;
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
  await cloudinary.uploader.destroy(book.coverId);
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
