const { status: httpStatus } = require('http-status');
const { authorService } = require('../services');
const pick = require('../utils/pick');

const createAuthor = async (req, res) => {
  const author = await authorService.createAuthor(req.body);
  res.status(httpStatus.CREATED).send(author);
};

const getAllAuthors = async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const authors = await authorService.queryAuthors(filter, options);
  res.status(httpStatus.OK).send(authors);
};

const getAuthor = async (req, res) => {
  const author = await authorService.getAuthorById(req.params.authorId);
  res.status(httpStatus.OK).send(author);
};

const updateAuthor = async (req, res) => {
  const author = await authorService.updateAuthorById(req.params.authorId, req.body);
  res.status(httpStatus.OK).send(author);
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
