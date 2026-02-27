const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBook = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().integer().min(0),
    author: Joi.string().custom(objectId).required(),
    category: Joi.string().custom(objectId).required(),
  }),
};

const getBooks = {
  query: Joi.object().keys({
    name: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().when('minPrice', {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref('minPrice')),
      otherwise: Joi.number().min(0),
    }),
    author: Joi.string().custom(objectId),
    category: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

const getBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

const updateBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      cover: Joi.string().uri(),
      price: Joi.number().min(0),
      stock: Joi.number().integer().min(0),
      author: Joi.string().custom(objectId),
      category: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
};
