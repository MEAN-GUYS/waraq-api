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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and retrieval
 */
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order
 *     description: Logged in users can create orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - address
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - book
 *                     - quantity
 *                   properties:
 *                     book:
 *                       type: string
 *                       description: Book ID
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                 minItems: 1
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - country
 *                 properties:
 *                   street:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 200
 *                   city:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 100
 *                   country:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 100
 *             example:
 *               items:
 *                 - book: 60a5b28a7e4b9c1d8c4e5f6a
 *                   quantity: 2
 *               address:
 *                 street: 123 Main St
 *                 city: Cairo
 *                 country: Egypt
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "400":
 *         description: Bad request (insufficient stock or invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Insufficient stock for "The Great Gatsby".
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /orders/myorders:
 *   get:
 *     summary: Get my orders
 *     description: Logged in users can retrieve their own orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shippingStatus
 *         schema:
 *           type: string
 *           enum: [processing, out for delivery, delivered]
 *         description: Filter by shipping status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of orders
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Get all orders
 *     description: Only admins can retrieve all orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shippingStatus
 *         schema:
 *           type: string
 *           enum: [processing, out for delivery, delivered]
 *         description: Filter by shipping status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of orders
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Update order status
 *     description: Only admins can update order shipping and payment status.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               shippingStatus:
 *                 type: string
 *                 enum: [processing, out for delivery, delivered]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, success]
 *             example:
 *               shippingStatus: out for delivery
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "400":
 *         description: Bad request (invalid status transition)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Cannot transition from "processing" to "delivered"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
