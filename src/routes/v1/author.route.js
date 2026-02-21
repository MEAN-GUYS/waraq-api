const router = require('express').Router();
const roles = require('../../config/roles');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { authorValidation } = require('../../validations');
const { authorController } = require('../../controllers');

router
  .route('/')
  .post(auth, authorizeRoles([roles.admin]), validate(authorValidation.createAuthor), authorController.createAuthor)
  .get(validate(authorValidation.getAuthors), authorController.getAllAuthors);

router
  .route('/:authorId')
  .get(validate(authorValidation.getAuthor), authorController.getAuthor)
  .patch(auth, authorizeRoles([roles.admin]), validate(authorValidation.updateAuthor), authorController.updateAuthor)
  .delete(auth, authorizeRoles([roles.admin]), validate(authorValidation.deleteAuthor), authorController.deleteAuthor);
module.exports = router;
