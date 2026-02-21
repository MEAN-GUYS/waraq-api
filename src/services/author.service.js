const { status: httpStatus } = require('http-status');
const { Author } = require('../models');
const ApiError = require('../utils/ApiError');

const createAuthor = async (AuthorBody) => Author.create(AuthorBody);

const getAllAuthors = async () => Author.find();

const getAuthorById = (id) => Author.findById(id);

const updateAuthorById = async (id, body) => {
  const author = await getAuthorById(id);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'author not found');
  }
  Object.assign(author, body);
  await author.save();
  return author;
};

const deleteAuthorById = async (id) => {
  const author = await getAuthorById(id);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'author not found');
  }
  await author.deleteOne();
  return author;
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
