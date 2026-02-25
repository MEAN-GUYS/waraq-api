const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const cartValidation = require('../../validations/cart.validation');
const cartController = require('../../controllers/cart.controller');

const router = express.Router();

router.route('/').get(auth, cartController.getCart).delete(auth, cartController.clearCart);

router.route('/items').post(auth, validate(cartValidation.addItem), cartController.addItem);

router
  .route('/items/:bookId')
  .put(auth, validate(cartValidation.updateItem), cartController.updateItem)
  .delete(auth, validate(cartValidation.removeItem), cartController.removeItem);

module.exports = router;
