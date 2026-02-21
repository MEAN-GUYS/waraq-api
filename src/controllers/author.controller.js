const { status: httpStatus } = require('http-status');
const { authorService } = require('../services');
const ApiError = require('../utils/ApiError');
const createAuthor = async (req, res) => {
  const author = await authorService.createAuthor(req.body);
  res.status(httpStatus.CREATED).send(author);
};

const getAllAuthors = async (req, res) => {
  const authors = await authorService.getAllAuthors();
  res.status(httpStatus[200]).send(authors);
};

const getAuthor = async (req, res) => {
  const book = await authorService.getAuthorById(req.params.authorId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  res.send(book);
};

const updateAuthor = async (req, res) => {
  const Author = await authorService.updateAuthorById(req.params.authorId, req.body);
  res.send(Author);
};

const deleteAuthor = async (req, res) => {
  await authorService.deleteAuthorById(req.params.authorId);
  res.status(httpStatus.NO_CONTENT).send();
};
module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
