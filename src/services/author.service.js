const { status: httpStatus } = require('http-status');
const { Author, Book } = require('../models');
const ApiError = require('../utils/ApiError');
const escapeRegex = require('../utils/escapeRegex');

const createAuthor = async (authorBody) => Author.create(authorBody);

const queryAuthors = async (filter, options) => {
  const mongooseFilter = {};

  if (filter.name) {
    mongooseFilter.name = { $regex: escapeRegex(filter.name), $options: 'i' };
  }

  return Author.paginate(mongooseFilter, options);
};

const getAuthorById = async (id) => {
  const author = await Author.findById(id);

  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }

  return author;
};

const updateAuthorById = async (id, body) => {
  const author = await getAuthorById(id);
  Object.assign(author, body);
  await author.save();
  return author;
};

const deleteAuthorById = async (id) => {
  const author = await getAuthorById(id);

  const associatedBooks = await Book.exists({ author: id });
  if (associatedBooks) {
    throw new ApiError(httpStatus.CONFLICT, 'Cannot delete author with associated books');
  }

  await author.deleteOne();
  return author;
};

module.exports = {
  createAuthor,
  queryAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
