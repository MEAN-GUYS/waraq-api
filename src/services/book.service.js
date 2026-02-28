const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const escapeRegex = require('../utils/escapeRegex');
const { Book, Author, Category, Review, Cart } = require('../models');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const cloudinary = require('../config/cloudinary');

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
    mongooseFilter.author = Array.isArray(filter.author) ? { $in: filter.author } : filter.author;
  }

  if (filter.category) {
    mongooseFilter.category = Array.isArray(filter.category) ? { $in: filter.category } : filter.category;
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
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  await Review.deleteMany({ book: book._id });
  await Cart.updateMany({ 'items.book': bookId }, { $pull: { items: { book: bookId } } });
  await book.deleteOne();
  await cloudinary.uploader.destroy(book.coverId);

  return book;
};

const getTopBoughtBooks = async (limit = 10) => {
  const { Order } = require('../models');
  return Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.book', totalSold: { $sum: '$items.quantity' } } },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
    { $unwind: '$book' },
    { $lookup: { from: 'authors', localField: 'book.author', foreignField: '_id', as: 'book.author' } },
    { $unwind: { path: '$book.author', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'categories', localField: 'book.category', foreignField: '_id', as: 'book.category' } },
    { $unwind: { path: '$book.category', preserveNullAndEmptyArrays: true } },
    {
      $replaceRoot: {
        newRoot: { $mergeObjects: ['$book', { totalSold: '$totalSold' }] },
      },
    },
    {
      $addFields: {
        id: { $toString: '$_id' },
        'author.id': { $toString: '$author._id' },
        'category.id': { $toString: '$category._id' },
      },
    },
    { $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, 'author._id': 0, 'category._id': 0 } },
  ]);
};

const getTopAuthors = async (limit = 10) => {
  const { Order } = require('../models');
  return Order.aggregate([
    { $unwind: '$items' },
    { $lookup: { from: 'books', localField: 'items.book', foreignField: '_id', as: 'bookData' } },
    { $unwind: '$bookData' },
    { $group: { _id: '$bookData.author', totalSold: { $sum: '$items.quantity' } } },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    { $lookup: { from: 'authors', localField: '_id', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' },
    { $replaceRoot: { newRoot: { $mergeObjects: ['$author', { totalSold: '$totalSold' }] } } },
    { $addFields: { id: { $toString: '$_id' } } },
    { $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
  ]);
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  getTopBoughtBooks,
  getTopAuthors,
};
