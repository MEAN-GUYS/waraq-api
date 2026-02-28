const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const roles = require('../../config/roles');
const bookValidation = require('../../validations/book.validation');
const bookController = require('../../controllers/book.controller');
const router = express.Router();
const uploadMiddleware = require('../../middlewares/multer');
const allowedExtensions = require('../../config/allowedExtensions');
const reviewRoute = require('./review.route');

const upload = uploadMiddleware({ extensions: allowedExtensions.image });

router.use('/:bookId/reviews', reviewRoute);

router
  .route('/')
  .post(
    upload.single('cover'),
    auth,
    authorizeRoles([roles.admin]),
    validate(bookValidation.createBook),
    bookController.createBook
  )
  .get(validate(bookValidation.getBooks), bookController.getBooks);

router
  .route('/:bookId')
  .get(validate(bookValidation.getBook), bookController.getBook)
  .patch(
    upload.single('cover'),
    auth,
    authorizeRoles([roles.admin]),
    validate(bookValidation.updateBook),
    bookController.updateBook
  )
  .delete(auth, authorizeRoles([roles.admin]), validate(bookValidation.deleteBook), bookController.deleteBook);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and retrieval
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a book
 *     description: Only admins can create books.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - cover
 *               - price
 *               - stock
 *               - author
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *                 description: ObjectId of the author
 *               category:
 *                 type: string
 *                 description: ObjectId of the category
 *               cover:
 *                 type: string
 *                 format: uri
 *                 description: must be a valid URL
 *               price:
 *                 type: number
 *                 minimum: 0
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: stock must be an integer
 *             example:
 *               name: The Great Gatsby
 *               description: A classic novel by F. Scott Fitzgerald.
 *               cover: https://example.com/gatsby-cover.jpg
 *               price: 15.99
 *               stock: 50
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all books
 *     description: Retrieve all books.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Book name
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of books
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
 *                     $ref: '#/components/schemas/Book'
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
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book
 *     description: Fetch a book by ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a book
 *     description: Only admins can update books.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               cover:
 *                 type: string
 *                 format: uri
 *               price:
 *                 type: number
 *                 minimum: 0
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *             example:
 *               name: The Great Gatsby (Revised Edition)
 *               price: 19.99
 *               stock: 150
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a book
 *     description: Only admins can delete books.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
