const router = require('express').Router();
const roles = require('../../config/roles');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/authorizeRoles');
const authorValidation = require('../../validations/author.validation');
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

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management and retrieval
 */

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create an author
 *     description: Only admins can create authors.
 *     tags: [Authors]
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
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *             example:
 *               name: George Orwell
 *               bio: An English novelist, essayist, journalist and critic.
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Author'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all authors
 *     description: Retrieve all authors.
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Author name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of authors
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
 *                     $ref: '#/components/schemas/Author'
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
 * /authors/{id}:
 *   get:
 *     summary: Get an author
 *     description: Fetch author details by ID.
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Author'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an author
 *     description: Only admins can update authors.
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *             example:
 *               name: George Orwell updated
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Author'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an author
 *     description: Only admins can delete authors.
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author id
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
