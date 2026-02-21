const { status: httpStatus } = require('http-status');
const { authorService } = require('../services');

const createAuthor = async (req, res) => {
  const author = await authorService.createAuthor(req.body);
  res.status(httpStatus.CREATED).send(author);
};

module.exports = {
  createAuthor,
};
