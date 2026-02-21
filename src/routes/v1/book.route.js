const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const roles = require('../../config/roles');
const bookValidation = require('../../validations/book.validation');
const bookController = require('../../controllers/book.controller');
const router = express.Router();

router
  .route('/')
  .post(auth, authorizeRoles([roles.admin]), validate(bookValidation.createBook), bookController.createBook)
  .get(validate(bookValidation.getBooks), bookController.getBooks);

router
  .route('/:bookId')
  .get(validate(bookValidation.getBook), bookController.getBook)
  .patch(auth, authorizeRoles([roles.admin]), validate(bookValidation.updateBook), bookController.updateBook)
  .delete(auth, authorizeRoles([roles.admin]), validate(bookValidation.deleteBook), bookController.deleteBook);

module.exports = router;
