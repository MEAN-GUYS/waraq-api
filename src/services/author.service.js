const { Author } = require('../models');

const createAuthor = (AuthorBody) => {
  return Author.create(AuthorBody);
};

module.exports = {
  createAuthor,
};
