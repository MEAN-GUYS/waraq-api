const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const escapeRegex = require('../utils/escapeRegex');
const { Book, Author, Category, Review, Cart } = require('../models');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

const validateBookReferences = async (bookBody) => {
  const { author: authorId, category: categoryId } = bookBody;

  if (authorId) {
    const author = await Author.exists({ _id: authorId });
    if (!author) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
    }
  }

  if (categoryId) {
    const category = await Category.exists({ _id: categoryId });
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
  }
};

const createBook = async (bookBody, coverBuffer) => {
  await validateBookReferences(bookBody);

  const { secure_url, public_id } = await uploadToCloudinary(coverBuffer);

  return Book.create({ ...bookBody, cover: secure_url, coverId: public_id });
};

const queryBooks = async (filter, options) => {
  const mongooseFilter = {};
  const mongooseOptions = { ...options, populate: 'author,category' };

  if (filter.name) {
    mongooseFilter.name = { $regex: escapeRegex(filter.name), $options: 'i' };
  }

  if (filter.minPrice !== undefined) {
    mongooseFilter.price = { $gte: filter.minPrice };
  }

  if (filter.maxPrice !== undefined) {
    mongooseFilter.price = { ...mongooseFilter.price, $lte: filter.maxPrice };
  }

  if (filter.author) {
    mongooseFilter.author = filter.author;
  }

  if (filter.category) {
    mongooseFilter.category = filter.category;
  }

  return Book.paginate(mongooseFilter, mongooseOptions);
};

const getBookById = async (id) => {
  return Book.findById(id).populate('author').populate('category');
};

const updateBookById = async (bookId, updateBody, coverBuffer) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  await validateBookReferences(updateBody);

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
  const book = await mongoose.connection.transaction(async () => {
    const book = await getBookById(bookId);
    if (!book) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
    }

    await Review.deleteMany({ book: book._id });

    await Cart.updateMany({ 'items.book': bookId }, { $pull: { items: { book: bookId } } });

    await book.deleteOne();

    return book;
  });

  await cloudinary.uploader.destroy(book.coverId);

  return book;
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
