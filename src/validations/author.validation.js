const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAuthor = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    bio: Joi.string().allow('', null),
  }),
};

const getAuthors = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
  }),
};

const getAuthor = {
  params: Joi.object().keys({
    authorId: Joi.string().custom(objectId).required(),
  }),
};

const updateAuthor = {
  params: Joi.object().keys({
    authorId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      bio: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteAuthor = {
  params: Joi.object().keys({
    authorId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
