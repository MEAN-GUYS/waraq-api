const express = require('express');
const roles = require('../../config/roles');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const categoryValidation = require('../../validations/category.validation');
const { categoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth,
    authorizeRoles([roles.admin]),
    validate(categoryValidation.createCategory),
    categoryController.createCategory
  )
  .get(validate(categoryValidation.getCategories), categoryController.getCategories);

router
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(
    auth,
    authorizeRoles([roles.admin]),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory
  )
  .delete(
    auth,
    authorizeRoles([roles.admin]),
    validate(categoryValidation.deleteCategory),
    categoryController.deleteCategory
  );

module.exports = router;
