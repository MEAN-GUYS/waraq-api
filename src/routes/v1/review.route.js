const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router.route('/').post(auth, validate(reviewValidation.createReview), reviewController.createReview);

router.route('/book/:bookId').get(validate(reviewValidation.getBookReviews), reviewController.getBookReviews);

module.exports = router;
