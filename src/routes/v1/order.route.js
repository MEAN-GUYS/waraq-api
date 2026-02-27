const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const roles = require('../../config/roles');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

const scopeToCurrentUser = (req, res, next) => {
  req.additionalFilters = { user: req.user.id };
  next();
};

router.route('/').post(auth, validate(orderValidation.createOrder), orderController.createOrder);

router.route('/myorders').get(auth, validate(orderValidation.getOrders), scopeToCurrentUser, orderController.getOrders);

router
  .route('/all')
  .get(auth, authorizeRoles([roles.admin]), validate(orderValidation.getOrders), orderController.getOrders);

router
  .route('/:orderId')
  .patch(
    auth,
    authorizeRoles([roles.admin]),
    validate(orderValidation.updateOrderStatus),
    orderController.updateOrderStatus
  );

module.exports = router;
