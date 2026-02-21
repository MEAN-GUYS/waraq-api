const router = require('express').Router();
const roles = require('../../config/roles');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const { authorValidation } = require('../../validations');
const { authController } = require('../../controllers');

router
  .route('/')
  .post(auth, authorizeRoles([roles.admin]), validate(authorValidation.createAuthor), authController.createAuthor)
  .get();

router.route('/:authorId').get().patch().delete();
module.exports = router;
