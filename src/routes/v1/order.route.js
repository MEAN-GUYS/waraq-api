const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .get(auth, validate(orderValidation.getOrders), orderController.getOrders)
  .post(auth, validate(orderValidation.createOrder), orderController.createOrder);

router.route('/:orderId').get(auth, validate(orderValidation.getOrder), orderController.getOrder);

router
  .route('/:orderId/status')
  .patch(auth, validate(orderValidation.updateOrderStatus), orderController.updateOrderStatus);

router
  .route('/:orderId/items/:itemId/review')
  .patch(auth, validate(orderValidation.reviewItem), orderController.reviewItem);

module.exports = router;
