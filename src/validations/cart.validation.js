const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addItem = {
  body: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const removeItem = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

module.exports = { addItem, updateItem, removeItem };
