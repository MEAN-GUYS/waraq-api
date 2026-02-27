const { status: httpStatus } = require('http-status');
const { Author, Book } = require('../models');
const ApiError = require('../utils/ApiError');

const createAuthor = async (AuthorBody) => Author.create(AuthorBody);

const getAllAuthors = async () => Author.find();

const getAuthorById = async (id) => Author.findById(id);

const updateAuthorById = async (id, body) => {
  const author = await getAuthorById(id);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }
  Object.assign(author, body);
  await author.save();
  return author;
};

const deleteAuthorById = async (id) => {
  const author = await getAuthorById(id);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }

  const associatedBooks = await Book.exists({ author: id });
  if (associatedBooks) {
    throw new ApiError(httpStatus.CONFLICT, 'Cannot delete author with associated books');
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
