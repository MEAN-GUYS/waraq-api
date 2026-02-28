const { status: httpStatus } = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { bookService } = require('../services');

const createBook = async (req, res) => {
  const book = await bookService.createBook(req.body, req.file?.buffer);
  res.status(httpStatus.CREATED).send(book);
};

const getBooks = async (req, res) => {
  const filter = pick(req.query, ['name', 'minPrice', 'maxPrice', 'author', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await bookService.queryBooks(filter, options);
  res.send(result);
};

const getBook = async (req, res) => {
  const book = await bookService.getBookById(req.params.bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  res.send(book);
};

const updateBook = async (req, res) => {
  const book = await bookService.updateBookById(req.params.bookId, req.body, req.file?.buffer);
  res.send(book);
};

const deleteBook = async (req, res) => {
  await bookService.deleteBookById(req.params.bookId);
  res.status(httpStatus.NO_CONTENT).send();
};

const getTopBoughtBooks = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const books = await bookService.getTopBoughtBooks(limit);
  res.send(books);
};

const getTopAuthors = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const authors = await bookService.getTopAuthors(limit);
  res.send(authors);
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getTopBoughtBooks,
  getTopAuthors,
};
